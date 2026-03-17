
// LOAD ENV
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./database/db.js";

// ROUTES
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import wishlistRoute from "./routes/wishlistRoute.js";
import profileRoute from "./routes/profileRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import newsletterRoute from "./routes/newsletterRoute.js";
import roomRoutes from "./routes/roomRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminContactRoutes from "./routes/adminContactRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import uploadBlogImageRoute from "./routes/uploadBlogImage.js";
import orderRoutes from "./routes/orderRoutes.js";
import giftCardRoutes from "./routes/giftCardRoutes.js";

// CREATE APP
const app = express();

// MIDDLEWARE
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// DEBUG LOGGER
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// STATIC FILES
app.use(
  "/images",
  express.static(path.join(process.cwd(), "public/images"))
);

app.use(
  "/models",
  express.static(path.join(process.cwd(), "public/models"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".glb")) {
        res.setHeader("Content-Type", "model/gltf-binary");
      }
    },
  })
);

// ROUTES
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/profile", profileRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/newsletter", newsletterRoute);
app.use("/api/rooms", roomRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/contacts", adminContactRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/upload/blog", uploadBlogImageRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/giftcards", giftCardRoutes);

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ERROR HANDLER 
app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

// CREATE SERVER
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(" Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log(" Socket disconnected:", socket.id);
  });
});

// EXPORT IO
export { io };

// START SERVER ONLY AFTER DB CONNECTS
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log(" MongoDB Connected");

    server.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB Connection Failed:", err);
    process.exit(1);
  });

