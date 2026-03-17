import express from "express";
import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/productModel.js";
import { isAuthenticated, isAdmin } from "../middlewares/isAuthenticated.js";
import GiftCard from "../models/GiftCard.js";

const router = express.Router();

router.get("/my", isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});





/* CREATE ORDER  */
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { items, totalAmount, giftCode, giftUsed } = req.body;

    if (giftCode && giftUsed > 0) {
      const gift = await GiftCard.findOne({ code: giftCode });

      if (!gift || gift.balance < giftUsed) {
        return res.status(400).json({ message: "Invalid gift card" });
      }

      gift.balance -= giftUsed;
      if (gift.balance === 0) gift.isUsed = true;
      await gift.save();
    }

    const orderId = crypto.randomBytes(6).toString("hex");

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product?.name || "Product"} is out of stock`,
        });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
  orderId,
  user: req.user._id,
  items: items.map((item) => ({
    product: item.product,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    img: item.img, 
  })),
  total: totalAmount,
});


    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Order failed" });
  }
});




/*  ADMIN ORDERS */
router.get("/admin", isAuthenticated, isAdmin, async (req, res) => {
  const orders = await Order.find()
    .populate("user", "email")
    .sort({ createdAt: -1 });

  res.json({ success: true, orders });

});

/* UPDATE STATUS  */
router.put("/admin/:id/status", isAuthenticated, isAdmin, async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(order);
});

/* TRACK ORDER  */

router.get("/track", async (req, res) => {
  const { orderId } = req.query;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID required" });
  }

  const order = await Order.findOne({ orderId });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
});

// cancel order (only if Confirmed)
router.put("/cancel/:id", isAuthenticated, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.status !== "Confirmed")
    return res.status(400).json({ message: "Cannot cancel now" });

  order.status = "Cancelled";
  await order.save();

  res.json({ success: true, order });
});


export default router;
