import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { deleteTempFile } from "./deletetempFile.js";

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
    return{
      publicId: res.public_id,
      url: res.secure_url
    }
  } catch (err) {
    throw new Error("Cloudinary upload failed");
  }finally {
    deleteTempFile(filePath);
  }
};

export const deleteCloudinaryImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};