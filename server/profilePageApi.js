const pool = require("../db/db");
const getSession = require("./getSession");

async function profilePageApi(req, res) {
  session = getSession(req);

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
      "SELECT posts.content, users.email, users.full_name FROM posts JOIN users ON posts.user_id WHERE email = $1",
      [email],
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        email: result.email,
        fullName: result.full_name,
        posts: posts.rows,
      }),
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ err: "Internal server error" }));
  }
}

module.exports = profilePageApi;
