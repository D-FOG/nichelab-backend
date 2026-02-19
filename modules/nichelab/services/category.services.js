import NicheCategory from "../model/category.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { uploadImage } from "../../../utils/cloudinary.js";

export const createNicheCategory = async (data) => {
  const exists = await NicheCategory.findOne({ name: data.name });
  if (exists) throw new ApiError(409, "Category already exists");

  return await NicheCategory.create(data);
};

export const getAllNicheCategories = async () => {
  return await NicheCategory.find({ isActive: true }).sort({ createdAt: -1 });
};

export const getNicheCategoryById = async (id) => {
  const category = await NicheCategory.findById(id);
  if (!category) throw new ApiError(404, "Category not found");
  return category;
};

export const updateCategoryById = async (id, data = {}, filePath) => {
  const category = await NicheCategory.findById(id);
  if (!category) throw new ApiError(404, "Category not found");

  // If a new image file path is provided, upload and set the image URL
  if (filePath) {
    try {
      const img = await uploadImage(filePath);
      if (img && img.url) category.image = img.url;
    } catch (err) {
      // propagate cloudinary errors so controller can handle
      throw err;
    }
  }

  // Merge provided data (name, description, etc.)
  Object.assign(category, data);
  await category.save();
  return category;
};

export const deleteNicheCategory = async (id) => {
  const category = await NicheCategory.findById(id);
  if (!category) throw new ApiError(404, "Category not found");

  category.isActive = false;
  await category.save();
  return category;
};