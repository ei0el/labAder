const http = require("http");
const path = require("path");
const loginApi = require("./loginApi");
const signUpApi = require("./signUpApi");
const feedApi = require("./feedApi");
const serveStaticFiles = require("./serveStaticFiles");
const postApi = require("./postApi");
const profilePageApi = require("./profilePageApi");
const logout = require("./logoutApi");
const changePassword = require("./changePassword");
const PORT = process.env.PORT;

let i = 0;

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
    if (req.url === "/public/scripts/profilePage.js") {
      return serveStaticFiles(
        res,
        path.join(__dirname, "../public/scripts/", "profilePage.js"),
        "application/javascript",
      );
    }
    if (req.url === "/public/scripts/changePassword.js") {
      return serveStaticFiles(
        res,
        path.join(__dirname, "../public/scripts/", "changePassword.js"),
        "application/javascript",
      );
    }
    if (req.url === "/public/scripts/resetPassword.js") {
      return serveStaticFiles(
        res,
        path.join(__dirname, "../public/scripts/", "resetPassword.js"),
        "application/javascript",
      );
    }

    if (req.url === "/feed") {
      feedApi(req, res);
    }

    if (req.url === "/profilepage") {
      profilePageApi();
    }
  }

  if (req.method === "POST") {
    if (req.url === "/login") {
      loginApi(req, res);
    } else if (req.url === "/signup") {
      signUpApi(req, res);
    } else if (req.url === "/logout") {
      logout(req, res);
    } else if (req.url === "/post") {
      postApi(req, res);
    } else {
      console.log(`No Output ${++i}`);
    }
  }

  if (req.method === "PUT") {
    if (req.url === "/changepassword") {
      changePassword();
    }
  }
});

server.listen(PORT, () => {
  console.log(`labAder server running on port ${PORT}`);
});
