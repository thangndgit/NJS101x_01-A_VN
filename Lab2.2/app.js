const http = require("http");

const express = require("express");

const app = express();

app.use((req, res, next) => {
  console.log("This is the first middleware!");
  next();
});

app.use((req, res, next) => {
  console.log("This is the second middleware!");
});

const server = http.createServer(app);

server.listen(3000);
