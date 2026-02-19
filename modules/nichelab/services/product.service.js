import NicheProduct from "../model/product.model.js";
import NicheCategory from "../model/category.model.js";
import { uploadImage, deleteCloudinaryImage } from "../../../utils/cloudinary.js";
import { ApiError } from "../../../utils/ApiError.js";

export const createNicheProduct = async (data, files) => {
  const category = await NicheCategory.findById(data.category);
  if (!category) throw new ApiError(404, "Category not found");

  const images = [];
  if (files?.length) {
    for (const file of files) {
      images.push(await uploadImage(file.path));
    }
  }

  return await NicheProduct.create({
    ...data,
    images,
  });
};

export const updateNicheProduct = async (id, data, files) => {
  const product = await NicheProduct.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  Object.assign(product, data);

  if (files?.length) {
    for (const file of files) {
      product.images.push(await uploadImage(file.path));
    }
  }

  await product.save();
  return product;
};

export const deleteNicheProduct = async (id) => {
  const product = await NicheProduct.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  for (const img of product.images) {
    await deleteCloudinaryImage(img.publicId);
  }

  product.archived = true;
  product.isActive = false;
  product.images = [];
  await product.save();

  return product;
};

export const getAllNicheProducts = async (query = {}) => {
  const { category, page = 1, limit = 10, search, ...filters } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = { archived: false, ...filters };
  if (search) filter.name = { $regex: search, $options: "i" };

  const [products, total] = await Promise.all([
    NicheProduct.find(filter)
      .populate("category", "name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    NicheProduct.countDocuments(filter),
  ]);

  return {
    data: products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit) || 1),
    },
  };
};

export const getNicheProductById = async (id) => {
  const product = await NicheProduct.findById(id).populate(
    "category",
    "name description"
  );
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const getNicheProductsByCategory = async (categoryId) => {
  return await NicheProduct.find({
    category: categoryId,
    archived: false,
  }).populate("category", "name");
};