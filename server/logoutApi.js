const getSession = require("./getSession");

function logoutApi(req, res) {
  const session = getSession.getSession(req);

  if (session) {
    const cookieHeader = req.headers.cookie;
    const sessionId = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("sessionId="))
      .split("=")[1];

    delete getSession.sessions[sessionId];
  }

  res.writeHead(200, {
    "Set-Cookie": "sessionId=; Max-Age=0",
  });
  res.end(JSON.stringify({ message: "Logged out" }));
}

module.exports = logoutApi;
