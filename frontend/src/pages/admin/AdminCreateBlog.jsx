import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminCreateBlog = () => {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
  });

  /* IMAGE UPLOAD */
  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("image", file);

    const res = await axios.post(
      "http://localhost:3000/api/upload/blog/admin",
      fd,
      { withCredentials: true }
    );

    setForm((prev) => ({
      ...prev,
      coverImage: res.data.url,
    }));
  };

  /* SUBMIT */
  const submitBlog = async () => {
    if (!form.title || !form.slug || !form.content) {
      toast.error("Title, slug, and content are required");
      return;
    }

    try {
      const loading = toast.loading("Publishing blog...");

      await axios.post(
        "http://localhost:3000/api/blogs/admin",
        form,
        { withCredentials: true }
      );

      toast.success("Blog published successfully ✨", { id: loading });

      setForm({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to publish blog"
      );
    }
  };

  return (
    <div className="bg-[#f3ece2] min-h-screen">
      <div className="pt-32 pb-20 max-w-3xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-10">
          <p className="uppercase tracking-widest text-sm text-gray-500">
            Admin Panel
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#3f3a33] mt-2">
            Publish a Blog
          </h1>
          <p className="text-gray-600 mt-2 text-sm max-w-xl">
            Create and publish stories directly to the platform.
          </p>
        </div>

        <div className="space-y-8">

          {/* TITLE */}
          <div>
            <label className="block text-sm mb-1 text-gray-600">
              Blog Title
            </label>
            <input
              value={form.title}
              placeholder="Minimal living room ideas"
              className="w-full border-b border-gray-300 focus:border-black outline-none py-3 text-lg bg-transparent"
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                  slug: e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, ""),
                })
              }
            />
          </div>

          {/* SLUG */}
          <div>
            <label className="block text-sm mb-1 text-gray-600">
              URL Slug
            </label>
            <input
              value={form.slug}
              className="w-full border-b border-gray-200 focus:border-black outline-none py-2 text-sm text-gray-500 bg-transparent"
              onChange={(e) =>
                setForm({ ...form, slug: e.target.value })
              }
            />
          </div>

          {/* EXCERPT */}
          <div>
            <label className="block text-sm mb-1 text-gray-600">
              Short Excerpt
            </label>
            <textarea
              rows={3}
              value={form.excerpt}
              placeholder="A short summary shown on blog listing..."
              className="w-full border border-gray-200 rounded-md p-3 text-sm focus:border-black outline-none"
              onChange={(e) =>
                setForm({ ...form, excerpt: e.target.value })
              }
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm mb-2 text-gray-600">
              Cover Image
            </label>

            {!form.coverImage ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-44 cursor-pointer hover:border-black transition">
                <span className="text-sm text-gray-500">
                  Click to upload cover image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => uploadImage(e.target.files[0])}
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={`http://localhost:3000${form.coverImage}`}
                  alt="cover"
                  className="h-56 w-full object-cover rounded-lg"
                />
                <button
                  onClick={() =>
                    setForm({ ...form, coverImage: "" })
                  }
                  className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div>
            <label className="block text-sm mb-2 text-gray-600">
              Blog Content
            </label>
            <textarea
              rows={8}
              value={form.content}
              placeholder="Write your full blog content here..."
              className="w-full border border-gray-200 rounded-xl p-5 text-sm leading-relaxed focus:border-black outline-none"
              onChange={(e) =>
                setForm({ ...form, content: e.target.value })
              }
            />
          </div>

          {/* SUBMIT */}
          <div className="pt-6">
            <button
              onClick={submitBlog}
              className="px-10 py-3 rounded-full tracking-wide bg-[#1a1816] hover:bg-black text-white transition"
            >
              Publish Blog
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminCreateBlog;
