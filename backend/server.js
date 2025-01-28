const app = require("./app");
const dotenv = require("dotenv");
console.log("NODE_ENV is:", process.env.NODE_ENV);
const express = require("express");

const path = require("path");
const connectDatabase = require("./config/database");
dotenv.config({ path: path.join(__dirname, "config/config.env") });

connectDatabase();

const Server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started running on port ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});

if (process.env.NODE_ENV.trim() == "production") {
  console.log("production ma");
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to unhandled rejection`);
  Server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to uncaught Errors`);
  Server.close(() => {
    process.exit(1);
  });
});
