import { Review } from "../models/reviewModel.js";
import Product from "../models/productModel.js";

export const getReviews = async (req, res) => {
  const { productId } = req.params;
  const reviews = await Review.find({ product: productId })
    .sort({ createdAt: -1 });
  res.json(reviews);
};

export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment required" });
    }

    
    const already = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (already) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,     
      name: req.user.name,
      rating: Number(rating),
      comment,
    });

    //  Update product rating correctly
    const reviews = await Review.find({ product: productId });

    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: avg.toFixed(1),
      reviewCount: reviews.length,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit review" });
  }
};
