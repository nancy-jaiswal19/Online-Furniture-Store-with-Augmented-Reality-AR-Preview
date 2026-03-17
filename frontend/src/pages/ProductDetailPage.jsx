import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiHeart,
  FiTruck,
  FiShield,
  FiRefreshCcw,
} from "react-icons/fi";

import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";

import ARViewer from "../components/ARViewer";
import StarRating from "./StarRating";
import { getProduct } from "../services/productService";
import { addToCart as addToCartAPI } from "../services/cartService";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService";
import { getReviews, addReview } from "../services/reviewService";
import { useApp } from "../context/AppContext";

const TABS = ["description", "specs", "care", "reviews"];

/* ================= REVIEW SECTION ================= */

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const loadReviews = async () => {
    const data = await getReviews(productId);
    setReviews(data);
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      await addReview({ productId, rating, comment });
      setComment("");
      setRating(5);
      loadReviews();
      toast.success("Review submitted");
    } catch {
      toast.error("Login required to review");
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border">
        <h3 className="font-semibold mb-3">Write a review</h3>
        <StarRating rating={rating} setRating={setRating} editable />

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border mt-4 p-3 rounded-xl"
          placeholder="Share your experience"
        />

        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-3 rounded-full bg-slate-900 text-white hover:bg-slate-800"
        >
          Submit Review
        </button>
      </div>

      {reviews.map((r) => (
        <div key={r._id} className="bg-white p-5 rounded-xl border">
          <div className="flex justify-between">
            <p className="font-medium">{r.name}</p>
            <StarRating rating={r.rating} />
          </div>
          <p className="mt-2 text-gray-600">{r.comment}</p>
        </div>
      ))}
    </div>
  );
};

/* ================= PRODUCT PAGE ================= */

const ProductDetailPage = () => {
  const { id } = useParams();
  const { setWishlistCount, setCartCount } = useApp();

  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [wishlisted, setWishlisted] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const API = import.meta.env.VITE_API_URL;


  /* ---------- LOAD PRODUCT ---------- */
  useEffect(() => {
    const load = async () => {
      const data = await getProduct(id);
      setProduct(data);
    };
    load();
  }, [id]);

  /* ---------- LOAD WISHLIST ---------- */
  useEffect(() => {
    const loadWishlist = async () => {
      const items = await getWishlist();
      setWishlisted(items.some((p) => p._id === id || p.product?._id === id));
      setWishlistCount(items.length);
    };
    loadWishlist();
  }, [id, setWishlistCount]);

  /* ---------- SAFE GUARD ---------- */
  if (!product) {
    return (
      <div className="pt-40 text-center text-gray-500">
        Loading product…
      </div>
    );
  }

  /* ---------- SAFE MODEL URL ---------- */
  const modelUrl = product.modelUrl
    ? `${import.meta.env.VITE_API_URL}${product.modelUrl}`
    : null;

  return (
    <div className="bg-[#f6f4ef] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ================= HERO ================= */}
        <div className="grid md:grid-cols-2 gap-20">

          {/* IMAGE */}
          <div className="bg-white rounded-3xl p-14 flex items-center justify-center">
            <img
              src={product.img}
              alt={product.name}
              className="max-h-[420px] object-contain"
            />
          </div>

          {/* INFO */}
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold">{product.name}</h1>

            <StarRating rating={product.rating} />

            <p className="text-3xl font-medium">₹{product.price}</p>

            {/* STOCK */}
            <p
              className={`text-sm font-medium ${
                product.stock > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.stock > 0
                ? `In stock (${product.stock} available)`
                : "Out of stock"}
            </p>

            {/* ACTIONS */}
            <div className="flex flex-wrap items-center gap-4 pt-4">

              {/* ADD TO CART */}
              <button
                disabled={product.stock === 0}
                onClick={async () => {
                  try {
                    await addToCartAPI(product._id, 1);
                    setCartCount((c) => c + 1);
                    toast.success("Added to cart");
                  } catch {
                    toast.error("Please login first");
                  }
                }}
                className={`px-10 py-4 rounded-full transition ${
                  product.stock === 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              {/* VIEW IN AR */}
              {modelUrl && (
                <button
                  onClick={() => setShowAR(true)}
                  className="px-8 py-4 rounded-full border bg-white hover:bg-gray-100"
                >
                  View in AR
                </button>
              )}

              {/* WISHLIST */}
              <button
                onClick={async () => {
                  try {
                    if (wishlisted) {
                      await removeFromWishlist(product._id);
                      setWishlisted(false);
                      setWishlistCount((c) => c - 1);
                      toast("Removed from wishlist");
                    } else {
                      await addToWishlist(product._id);
                      setWishlisted(true);
                      setWishlistCount((c) => c + 1);
                      toast.success("Saved to wishlist");
                    }
                  } catch {
                    toast.error("Please login first");
                  }
                }}
                className="p-4 rounded-full border hover:bg-rose-50"
              >
                {wishlisted ? (
                  <FaHeart className="text-rose-500" />
                ) : (
                  <FiHeart className="text-gray-600" />
                )}
              </button>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-4 pt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2"><FiTruck /> Free Delivery</div>
              <div className="flex items-center gap-2"><FiShield /> Warranty</div>
              <div className="flex items-center gap-2"><FiRefreshCcw /> Easy Returns</div>
            </div>
          </div>
        </div>

        {/* ================= TABS ================= */}
        <div className="mt-28">
          <div className="flex gap-12 border-b">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-black"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-10 max-w-3xl">
            {activeTab === "description" && <p>{product.description}</p>}
            {activeTab === "specs" && (
              <p>
                {product.dimensions?.width} × {product.dimensions?.height}
              </p>
            )}
            {activeTab === "care" && <p>Clean with dry cloth.</p>}
            {activeTab === "reviews" && (
              <ReviewSection productId={product._id} />
            )}
          </div>
        </div>
      </div>

      {/* ================= AR VIEWER ================= */}
      {showAR && modelUrl && (
        <ARViewer
          modelUrl={modelUrl}
          onClose={() => setShowAR(false)}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
