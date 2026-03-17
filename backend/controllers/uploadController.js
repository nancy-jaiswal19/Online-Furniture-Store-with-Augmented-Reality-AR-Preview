// import cloudinary from "../config/cloudinary.js";

// export const uploadImage = async (req, res) => {
//   try {
//     console.log("FILE:", req.file);

//     if (!req.file) {
//       return res.status(400).json({ message: "No file received" });
//     }

//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "products",
//     });

    

//     res.json({ url: result.secure_url });
//   } catch (err) {
//     console.error("UPLOAD ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
