const fs = require("fs");

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

module.exports = serveStaticFiles;
