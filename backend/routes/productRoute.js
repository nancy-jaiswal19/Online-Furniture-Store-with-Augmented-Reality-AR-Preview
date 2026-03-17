import express from "express";
import Product from "../models/productModel.js";
import {
  listProducts,
  getProduct,
  getBestSellers,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

/* STATIC ROUTES FIRST */
router.get("/best-sellers", getBestSellers);

/* MAIN ROUTES */
router.get("/", listProducts);
router.post("/", createProduct);

/*  DYNAMIC ROUTES LAST */
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
