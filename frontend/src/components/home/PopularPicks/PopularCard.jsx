import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../services/wishlistService";
import { useApp } from "../../../context/AppContext";

const PopularCard = ({ product }) => {
  const {
    wishlistIds = [],
    wishlistLoading,
    setWishlistIds,
    setWishlistCount,
  } = useApp();

  if (wishlistLoading) return null;

  const liked = wishlistIds.includes(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product?._id) return;

    try {
      if (liked) {
        await removeFromWishlist(product._id);
        setWishlistIds((prev) => prev.filter((id) => id !== product._id));
        setWishlistCount((c) => Math.max(c - 1, 0));
      } else {
        await addToWishlist(product._id);
        setWishlistIds((prev) => [...prev, product._id]);
        setWishlistCount((c) => c + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-60 select-none">
      <div className="relative w-full h-64 bg-white border rounded-lg overflow-hidden group">

        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-20"
        >
          {liked ? (
            <FaHeart size={18} className="text-red-500" />
          ) : (
            <FiHeart size={18} className="text-gray-600 hover:text-black" />
          )}
        </button>

        {(product.imageUrl || product.img) ? (
          <img
            src={product.imageUrl || product.img}
            alt={product.name}
            className="w-full h-full object-cover transition group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      <p className="mt-3 text-sm font-medium">{product.name}</p>
      <p className="font-semibold">₹{product.price}</p>
    </div>
  );
};

export default PopularCard;
