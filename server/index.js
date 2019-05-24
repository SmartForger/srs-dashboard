const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
require('dotenv').config();

const apiRoute = require('./api');

if (process.env.NODE_ENV === "production") {
  const forceSSL = function() {
    return function(req, res, next) {
      if (req.headers["x-forwarded-proto"] !== "https") {
        return res.redirect(["https://", req.get("Host"), req.url].join(""));
      }
      next();
    };
  };

  app.use(forceSSL());
}
app.use(cors());
app.use(express.static(path.join(__dirname, "../dist")));
app.use(apiRoute());
app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, function() {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});
