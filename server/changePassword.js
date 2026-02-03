const pool = require("../db/db");
const getSession = require("./getSession");
const bcrypt = require("bcrypt");

async function changePassword(req, res) {
  const session = getSession.getSession(req);
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const { oldPassword, newPassword, confirmPassword } = JSON.parse(body);

      if (!oldPassword || !newPassword || !confirmPassword) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Password Field Empty" }));
      }

      if (newPassword !== confirmPassword) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Pasword doesn't match" }));
      }

      if (!session) {
        res.writeHead(401, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Unauthorized" }));
      }

      const result = await pool.query(
        "SELECT id, email, password FROM users WHERE email = $1",
        [session.email],
      );

      if (result.rows.length === 0) {
        res.writeHead(401, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            error: "Invalid user",
          }),
        );
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        res.writeHead(401, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            error: "Invalid password",
          }),
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const result2 = await pool.query(
        "UPDATE users SET password = $1 WHERE id = $2 RETURNING id, email",
        [hashedPassword, user.id],
      );
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Password Changed",
          result: result2.rows[0],
        }),
      );
    } catch (err) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
}

module.exports = changePassword;
