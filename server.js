const express = require("express");
const app = express();
const path = require("path");

require("dotenv").config();


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
app.use(express.static(path.join(__dirname, "dist")));
app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, function() {
  console.log(`Server listening on port ${PORT}`);
});
