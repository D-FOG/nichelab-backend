import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath) => {
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder: "wamze/products",
    });
    return res.secure_url;
  } catch (err) {
    throw new Error("Cloudinary upload failed");
  }
};
