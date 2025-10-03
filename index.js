// index.js
// where your node app starts

// init project
const express = require('express');
const app = express();

// enable CORS (so your API is remotely testable by FCC)
const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// serve static files
app.use(express.static('public'));

// Root route: serve index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Hello API example
app.get("/api/hello", (req, res) => {
  res.json({ greeting: 'hello API' });
});

// Timestamp Microservice API
app.get("/api/:date?", (req, res) => {
  let dateParam = req.params.date;
  let date;

  if (!dateParam) {
    // No date parameter → current time
    date = new Date();
  } else if (/^\d+$/.test(dateParam)) {
    // Only digits → treat as milliseconds timestamp
    date = new Date(Number(dateParam));
  } else {
    // Otherwise treat as date string
    date = new Date(dateParam);
  }

  // Check if date is valid
  if (isNaN(date.getTime())) {
    res.json({ error: "Invalid Date" });
  } else {
    res.json({ unix: date.getTime(), utc: date.toUTCString() });
  }
});

// Listen on port
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
