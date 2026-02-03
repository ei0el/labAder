const getSession = require("./getSession");
const pool = require("../db/db");

function postApi(req, res) {
  const session = getSession.getSession(req);

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
}

module.exports = postApi;
