
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import Product from "./models/productModel.js";
import products from "./data/products.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    console.log("Old products deleted");

    await Product.insertMany(products);
    console.log("New products inserted");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();

