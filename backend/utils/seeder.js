const products = require("../data/product.json");
const Product = require("../models/productModel");
const dotenv = require("dotenv");

dotenv.config({ path: "backend/config/config.env" });

const connectDatabase = require("../config/database");

connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Emptied DB Successfully");
    await Product.insertMany(products);
    console.log("All Products added");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

seedProducts();
