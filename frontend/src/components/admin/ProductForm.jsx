import React, { useEffect, useState } from "react";
import { createProduct, getProduct, updateProduct } from "../../services/productService";
import { listCategories } from "../../services/categoryService";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [catsLoading, setCatsLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",        // ✅ slug
    imageUrl: "",
    modelUrl: "",        // ✅ AR model
    stock: 0,
    isActive: true,
  });

  /* ================= FETCH CATEGORIES + PRODUCT ================= */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCatsLoading(true);
        const cats = await listCategories({ active: true });
        setCategories(cats);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load categories");
      } finally {
        setCatsLoading(false);
      }
    };

    const loadProduct = async () => {
      if (!id) return;
      try {
        const p = await getProduct(id);
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price || 0,
          category: p.category || "",     // ✅ slug
          imageUrl: p.imageUrl || "",
          modelUrl: p.modelUrl || "",     // ✅ FIXED
          stock: p.stock || 0,
          isActive: p.isActive ?? true,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      }
    };

    loadCategories();
    loadProduct();
  }, [id]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.category) {
      toast.error("Name and category are required");
      return;
    }

    if (loading) return;

    let toastId;

    try {
      setLoading(true);
      toastId = toast.loading(id ? "Updating product..." : "Creating product...");

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (id) {
        await updateProduct(id, payload);
        toast.success("Product updated", { id: toastId });
      } else {
        await createProduct(payload);
        toast.success("Product created", { id: toastId });
      }

      navigate("/admin/products");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Save failed";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="bg-[#fbf9f6] min-h-screen pt-32 px-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-14">
          <p className="uppercase tracking-[0.3em] text-xs text-gray-500">
            Admin / Products
          </p>
          <h1 className="text-4xl font-semibold text-[#1a1816] mt-3">
            {id ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-gray-600 mt-2 max-w-xl">
            Manage your product catalog with accuracy and clarity.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-14">

          {/* BASIC INFO */}
          <section className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-lg font-medium text-[#1a1816] mb-8">
              Basic Information
            </h2>

            <div className="space-y-8">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                  Product Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Modern Wooden Chair"
                  className="w-full text-lg border-b border-gray-300 focus:border-black outline-none py-3 bg-transparent"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 focus:border-black outline-none py-3 bg-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {catsLoading && (
                  <p className="text-xs text-gray-400 mt-2">
                    Loading categories…
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* PRICING */}
          <section className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-lg font-medium text-[#1a1816] mb-8">
              Pricing & Inventory
            </h2>

            <div className="grid grid-cols-2 gap-10">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full text-lg border-b border-gray-300 focus:border-black outline-none py-3 bg-transparent"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full text-lg border-b border-gray-300 focus:border-black outline-none py-3 bg-transparent"
                />
              </div>
            </div>
          </section>

          {/* IMAGE */}
          <section className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-lg font-medium text-[#1a1816] mb-8">
              Product Image
            </h2>

            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full border border-gray-300 rounded-lg p-4 text-sm"
            />

            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Preview"
                className="mt-6 h-48 rounded-xl object-cover border"
              />
            )}
          </section>

          {/* AR MODEL */}
          <section className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-lg font-medium text-[#1a1816] mb-4">
              Augmented Reality
            </h2>

            <input
              name="modelUrl"
              value={form.modelUrl}
              onChange={handleChange}
              placeholder="https://yourdomain/models/chair.glb"
              className="w-full border border-gray-300 rounded-lg p-4 text-sm"
            />

            <p className="text-xs text-gray-500 mt-2">
              Optional. Add a .glb model URL to enable “View in AR”.
            </p>
          </section>

          {/* DESCRIPTION */}
          <section className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-lg font-medium text-[#1a1816] mb-8">
              Description
            </h2>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe materials, comfort, and design inspiration..."
              className="w-full border border-gray-300 rounded-xl p-5 text-sm leading-relaxed"
            />
          </section>

          {/* ACTION */}
          <div className="flex items-center justify-between pb-10">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                id="isActive"
              />
              <label htmlFor="isActive" className="text-sm text-gray-600">
                Product is active
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`px-12 py-4 rounded-full tracking-wide text-sm transition
                ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1a1816] text-white hover:bg-black"}
              `}
            >
              {loading ? "Saving…" : "Save Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProductForm;
