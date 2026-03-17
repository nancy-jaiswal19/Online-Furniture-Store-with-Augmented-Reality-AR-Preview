import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { addToWishlist, removeFromWishlist } from "../services/wishlistService";
import { useApp } from "../context/AppContext";

// 🔥 BASE URL WITHOUT /api (FOR IMAGES)
const API_BASE = import.meta.env.VITE_API_URL.replace("/api", "");

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { wishlistIds = [], setWishlistIds, setWishlistCount } = useApp();

  const productId = product._id;
  const liked = wishlistIds.includes(productId);

  /* ================= WISHLIST ================= */
  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (liked) {
      await removeFromWishlist(productId);
      setWishlistIds((ids) => ids.filter((id) => id !== productId));
      setWishlistCount((c) => Math.max(c - 1, 0));
    } else {
      await addToWishlist(productId);
      setWishlistIds((ids) => [...ids, productId]);
      setWishlistCount((c) => c + 1);
    }
  };

  /* ================= IMAGE NORMALIZATION ================= */
  const rawImage =
    product.imageUrl ||   // new products
    product.img ||        // old products
    "";

  const imageSrc = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${API_BASE}${rawImage}`
    : "";
console.log("RAW IMG:", rawImage);
console.log("FINAL SRC:", imageSrc);

  return (
    <div className="group space-y-3">
      {/* IMAGE CARD */}
      <div
        onClick={() => navigate(`/products/${productId}`)}
        className="
          relative
          bg-white
          rounded-3xl
          overflow-hidden
          cursor-pointer
          shadow-[0_8px_30px_rgba(0,0,0,0.06)]
          transition
          hover:shadow-[0_18px_60px_rgba(0,0,0,0.12)]
        "
      >
        {/* ❤️ Wishlist */}
        <button
          onClick={handleWishlist}
          className="
            absolute top-4 right-4 z-10
            bg-white/90 backdrop-blur
            p-2 rounded-full
            shadow
            opacity-0 group-hover:opacity-100
            transition
          "
        >
          {liked ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FiHeart className="text-gray-600 hover:text-black" />
          )}
        </button>

        {/* 🖼 IMAGE */}
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="
              w-full
              h-auto
              object-contain
              px-6 py-10
              transition-transform duration-700
              group-hover:scale-105
            "
          />
        ) : (
          <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
            No Image Available
          </div>
        )}
      </div>

      {/* TEXT */}
      <div className="px-1">
        <p className="text-[14px] font-medium text-[#1a1816] leading-snug">
          {product.name}
        </p>
        <p className="text-[13px] text-gray-600 mt-0.5">
          ₹{product.price?.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
