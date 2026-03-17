import express from "express";
import Blog from "../models/Blog.js";
import { isAuthenticated, isAdmin } from "../middlewares/isAuthenticated.js";

const router = express.Router();

/* ADMIN FIRST */
router.get("/admin/all", isAuthenticated, isAdmin, async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

router.put("/admin/:id/publish", isAuthenticated, isAdmin, async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { status: "published" },
    { new: true }
  );
  res.json(blog);
});


// ADMIN CREATE BLOG (DIRECT PUBLISH)
router.post("/admin", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      status: "published",
      author: req.user._id,
    });

    res.status(201).json(blog);
  } catch (err) {
    console.error("ADMIN BLOG CREATE ERROR ", err);
    res.status(500).json({ message: err.message });
  }
});

/* USER CREATE BLOG */
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { title, slug, excerpt, content, coverImage } = req.body;

    //  BASIC VALIDATION
    if (!title || !slug || !content) {
      return res.status(400).json({
        message: "Title, slug, and content are required",
      });
    }

    //  NORMALIZE SLUG
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    //  CHECK DUPLICATE SLUG
    const existing = await Blog.findOne({ slug: cleanSlug });
    if (existing) {
      return res.status(409).json({
        message: "Slug already exists. Choose a different one.",
      });
    }

    const blog = await Blog.create({
      title,
      slug: cleanSlug,
      excerpt,
      content,
      coverImage,
      author: req.user._id,
      status: "pending",
    });

    res.status(201).json(blog);
  } catch (err) {
    console.error("BLOG CREATE ERROR ", err);
    res.status(500).json({
      message: err.message,
    });
  }
});






router.get("/admin/pending", isAuthenticated, isAdmin, async (req, res) => {
  const blogs = await Blog.find({ status: "pending" })
    .select("title createdAt")
    .sort({ createdAt: -1 });

  res.json(blogs);
});


/* PUBLIC */
router.get("/", async (req, res) => {
  const blogs = await Blog.find({ status: "published" }).sort({
    createdAt: -1,
  });
  res.json(blogs);
});

router.get("/:slug", async (req, res) => {
  const blog = await Blog.findOne({
    slug: req.params.slug,
    status: "published",
  });
  if (!blog) return res.status(404).json({ message: "Not found" });
  res.json(blog);
});

// DELETE BLOG (ADMIN ONLY)
router.delete(
  "/admin/:id",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const blog = await Blog.findByIdAndDelete(req.params.id);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.json({ message: "Blog deleted successfully" });
    } catch (err) {
      console.error("BLOG DELETE ERROR ", err);
      res.status(500).json({ message: err.message });
    }
  }
);


export default router;
