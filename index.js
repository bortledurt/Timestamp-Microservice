// index.js
// where your node app starts

// init project
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

// Helper function to send JSON responses
function sendJSON(res, obj) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
}

// Helper function to send 404
function sendNotFound(res) {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 Not Found");
}

// Helper function to serve static files (like index.html)
function serveStaticFile(res, filepath, contentType) {
  fs.readFile(filepath, (err, content) => {
    if (err) {
      sendNotFound(res);
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
}

// your first API endpoint...
// http://expressjs.com/en/starter/basic-routing.html
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Root route: serve index.html
  if (pathname === "/") {
    // http://expressjs.com/en/starter/static-files.html
    serveStaticFile(res, path.join(__dirname, "views", "index.html"), "text/html");
    return;
  }

  // API endpoint: /api/:date?
  if (pathname.startsWith("/api")) {
    const parts = pathname.split("/");
    let dateParam = parts[2]; // may be undefined if empty

    // If no date parameter, return current time
    if (!dateParam) {
      const now = new Date();
      sendJSON(res, { unix: now.getTime(), utc: now.toUTCString() });
      return;
    }

    // If timestamp is numeric, convert to number
    if (/^\d+$/.test(dateParam)) {
      dateParam = parseInt(dateParam);
    }

    const date = new Date(dateParam);

    // Check if date is invalid
    if (date.toString() === "Invalid Date") {
      sendJSON(res, { error: "Invalid Date" });
    } else {
      sendJSON(res, { unix: date.getTime(), utc: date.toUTCString() });
    }
    return;
  }

  // fallback for anything else
  sendNotFound(res);
});

// Listen on port set in environment variable or default to 3000
const listener = server.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
