const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");

app.use(express.json());
const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");
dotenv.config({ path: path.join(__dirname, "config/config.env") });

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use("/api/v1", products);
app.use("/api/v1/", auth);
app.use("/api/v1", order);

console.log("profuction ma", process.env.NODE_ENV);
if (process.env.NODE_ENV.trim() === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);

module.exports = app;
