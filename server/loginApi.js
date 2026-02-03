const crypto = require("crypto");
const bcrypt = require("bcrypt");
const pool = require("../db/db");
const getSession = require("./getSession");

function loginApi(req, res) {
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

      getSession.sessions[sessionId] = {
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
}

module.exports = loginApi;
