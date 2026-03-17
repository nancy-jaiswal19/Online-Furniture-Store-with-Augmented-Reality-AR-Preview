import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },

    category: { type: String, required: true, index: true },
    room: { type: String, required: true, index: true },      

    img: { type: String, default: "" },
    modelUrl: { type: String, default: "" },


    stock: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    isBestSeller: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },

    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
    },
    material: String,
    warranty: String,
  },
  { timestamps: true }
);

// DEFAULT EXPORT (IMPORTANT)
const Product = mongoose.model("Product", productSchema);
export default Product;
