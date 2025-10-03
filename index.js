const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

function sendJSON(res, obj) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
}

function sendNotFound(res) {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 Not Found");
}

function serveStaticFile(res, filepath, contentType) {
  fs.readFile(filepath, (err, content) => {
    if (err) sendNotFound(res);
    else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Root route
  if (pathname === "/") {
    serveStaticFile(res, path.join(__dirname, "views", "index.html"), "text/html");
    return;
  }

  // API endpoint
  if (pathname.startsWith("/api")) {
    const parts = pathname.split("/");
    let dateParam = parts[2]; // may be undefined
    let date;

    if (!dateParam) {
      // No date → current time
      date = new Date();
    } else if (/^\d+$/.test(dateParam)) {
      // Only digits → treat as milliseconds
      date = new Date(Number(dateParam));
    } else {
      // Date string → pass as-is
      date = new Date(dateParam);
    }

    // Invalid date
    if (isNaN(date.getTime())) {
      sendJSON(res, { error: "Invalid Date" });
    } else {
      sendJSON(res, { unix: date.getTime(), utc: date.toUTCString() });
    }
    return;
  }

  sendNotFound(res);
});

const listener = server.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
