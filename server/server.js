const http = require("http");
const pool = require("../db/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT;
const sessions = {};

let i = 0;

function getSession(req) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = value;
    return acc;
  }, {});

  const sessionId = cookies.sessionId;
  if (!sessionId) return null;

  return sessions[sessionId] || null;
}

function serveStaticFiles(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("Page Not Found");
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET") {
    if (req.url === "/") {
      return serveStaticFiles(
        res,
        path.join(__dirname, "../public", "index.html"),
        "text/html",
      );
    }
    if (req.url === "/assets/defaultPicture.jpg") {
      return serveStaticFiles(
        res,
        path.join(__dirname, "../assets/", "defaultPicture.jpg"),
        "image/jpeg",
      );
    }
    if (req.url === "/public/css/style.css") {
      return serveStaticFiles(
        res,
        path.join(__dirname, "../public/css/", "style.css"),
        "text/css",
      );
    }
    if (req.url === "/public/scripts/app.js") {
      return serveStaticFiles(
        res,
        path.join(__dirname, "../public/scripts/", "app.js"),
        "application/javascript",
      );
    }
    if (req.url === "/public/scripts/clearApp.js") {
      return serveStaticFiles(
        res,
        path.join(__dirname, "../public/scripts/", "clearApp.js"),
        "application/javascript",
      );
    }
    if (req.url === "/public/scripts/displayLogin.js") {
      return serveStaticFiles(
        res,
        path.join(__dirname, "../public/scripts/", "displayLogin.js"),
        "application/javascript",
      );
    }
    if (req.url === "/public/scripts/displaySignUp.js") {
      return serveStaticFiles(
        res,
        path.join(__dirname, "../public/scripts/", "displaySignUp.js"),
        "application/javascript",
      );
    }
    if (req.url === "/public/scripts/createPost.js") {
      return serveStaticFiles(
        res,
        path.join(__dirname, "../public/scripts/", "createPost.js"),
        "application/javascript",
      );
    }
    if (req.url === "/public/scripts/logout.js") {
      return serveStaticFiles(
        res,
        path.join(__dirname, "../public/scripts/", "logout.js"),
        "application/javascript",
      );
    }
    if (req.url === "/public/scripts/displayFeed.js") {
      return serveStaticFiles(
        res,
        path.join(__dirname, "../public/scripts/", "displayFeed.js"),
        "application/javascript",
      );
    }

    if (req.url === "/feed") {
      const session = getSession(req);

      if (!session) {
        res.writeHead(401, { "Content-Type": "application/json " });
        return res.end(
          JSON.stringify({
            error: "Unauthorized",
          }),
        );
      }

      try {
        const result = await pool.query(
          `SELECT posts.id, posts.content, posts.created_at, users.email FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC`,
        );
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: `Welcome ${session.email}`,
            posts: result.rows,
          }),
        );
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ err: "Internal server error" }));
      }
    }
  }
  if (req.method === "POST" && req.url === "/signup") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { email, password, confirmPassword } = JSON.parse(body);

        if (!email || !password) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({ error: "Incorrect email or password" }),
          );
        }

        if (password !== confirmPassword) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Pasword doesn't match" }));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
          "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
          [email, hashedPassword],
        );

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "User created", result: result.rows[0] }),
        );
      } catch (err) {
        if (err.code === "23505") {
          res.writeHead(409, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({
              error: "Email already exists",
            }),
          );
        }
        res.writeHead(404, { "Content-Type": "applicatin/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    //register logic
  }
  if (req.method === "POST" && req.url === "/login") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { email, password } = JSON.parse(body);

        if (!email || !password) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({ error: "Email and password required" }),
          );
        }

        const result = await pool.query(
          "SELECT id, email, password FROM users WHERE email = $1",
          [email],
        );

        if (result.rows.length === 0) {
          res.writeHead(401, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({
              error: "Invalid email or password",
            }),
          );
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          res.writeHead(401, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({
              error: "Invalid email or password",
            }),
          );
        }

        const sessionId = crypto.randomBytes(32).toString("hex");

        sessions[sessionId] = {
          userId: user.id,
          email: user.email,
        };

        res.writeHead(200, {
          "Content-Type": "application/json",
          "Set-Cookie": `sessionId=${sessionId}; HttpOnly`,
        });

        res.end(JSON.stringify({ message: "Login Successful" }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
      }
    });
  } else if (req.method === "POST" && req.url === "/logout") {
    const session = getSession(req);

    if (session) {
      const cookieHeader = req.headers.cookie;
      const sessionId = cookieHeader
        .split("; ")
        .find((c) => c.startsWith("sessionId="))
        .split("=")[1];

      delete sessions[sessionId];
    }

    res.writeHead(200, {
      "Set-Cookie": "sessionId=; Max-Age=0",
    });
    res.end(JSON.stringify({ message: "Logged out" }));
  } else if (req.method === "POST" && req.url === "/posts") {
    const session = getSession(req);

    if (!session) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Unauthorized" }));
    }

    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { content } = JSON.parse(body);

        if (!content) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Post content required" }));
        }

        const result = await pool.query(
          "INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING id, content, created_at",
          [session.userId, content],
        );

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ post: result.rows[0] }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Server error" }));
      }
    });
  } else {
    console.log(`No output ${++i}`);
  }
});

server.listen(PORT, () => {
  console.log(`labAder server running on port ${PORT}`);
});
