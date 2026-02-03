const sessions = {};

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

module.exports = { getSession, sessions };
