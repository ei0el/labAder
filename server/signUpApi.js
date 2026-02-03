const bcrypt = require("bcrypt");
const pool = require("../db/db");

function signUpApi(req, res) {
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
}

module.exports = { signUpApi };
