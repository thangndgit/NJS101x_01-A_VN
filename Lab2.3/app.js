const http = require("http");

const express = require("express");

const app = express();

app.use((req, res, next) => {
  console.log("This is the first middleware!");
  next();
});

app.use((req, res, next) => {
  console.log("This is the second middleware!");
  res.send("<h1>Hello from Express.js</h1>");
});

const server = http.createServer(app);

server.listen(3000);
