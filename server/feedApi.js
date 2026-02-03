const pool = require("../db/db");
const getSession = require("./getSession");

async function feedApi(req, res) {
  const session = getSession.getSession(req);

  if (!session) {
    res.writeHead(401, { "Content-Type": "application/json" });
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

module.exports = feedApi;
