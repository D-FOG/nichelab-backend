import Product from "../../products/models/products.model.js";
import Category from "../../products/models/category.model.js";
import { uploadImage, deleteCloudinaryImage } from "../../../utils/cloudinary.js";
import { ApiError } from "../../../utils/ApiError.js";
//import { ApiResponse } from "../../utils/ApiResponse.js";

export const createProduct = async (name, description, price, bottleSize, categoryId, stock, tags, files) => {
  try {
    const cat = await Category.findById(categoryId);
    if (!cat) {
      throw new ApiError(404, "Category not found");
    }

    let images = [];

    if (files?.length) {
      for (const file of files) {
        const uploaded = await uploadImage(file.path);
        images.push(uploaded);
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      bottleSize,
      category: categoryId,
      stock,
      tags,
      images,
    });

    return product;
  } catch (err) {
    throw err;
  }
};

export const updateProduct = async (productId, updateData, files) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const fields = [
      "name",
      "description",
      "price",
      "bottleSize",
      "stock",
      "tags",
      "isActive",
      "archived",
    ];

    // category update
    if (updateData.category) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        throw new ApiError(404, "Category not found");
      }
      product.category = updateData.category;
    }

    fields.forEach((field) => {
      if (updateData[field] !== undefined) {
        product[field] = updateData[field];
      }
    });


    // discount logic
    if (updateData.isDiscounted !== undefined) {
      product.discount.isDiscounted = updateData.isDiscounted;

      if (updateData.isDiscounted) {
        product.discount.percentage = Number(updateData.discountPercentage || 0);
      } else {
        product.discount.percentage = 0;
      }
    }

    // upload new images (append)
    if (files?.length) {
      for (const file of files) {
        const uploaded = await uploadImage(file.path);
        product.images.push(uploaded);
      }
    }

    // // upload new images if any
    // if (imageFile?.length) {
    //   const uploaded = [];
    //   for (const file of imageFile) {
    //     const url = await uploadImage(file.path);
    //     uploaded.push(url);
    //   }
    //   product.images.push(...uploaded);
    // }

    await product.save();

    return product;
  } catch (err) {
    throw err;
  }
};


export const deleteProduct = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    //delete image fro, cloudinary
    for (const img of product.images) {
      await deleteCloudinaryImage(img.publicId);
    }

    product.archived = true;
    product.isActive = false;
    product.images = [];

    await product.save();

    return product;
  } catch (err) {
    throw err;
  }
};

export const getAllProducts = async (search, categoryId, tag, archived) => {
  try {
    const query = {};

    if (archived !== undefined) {
      query.archived = archived === "true";
    }

    if (categoryId) {
      query.category = categoryId;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return products;
  } catch (err) {
    throw err;
  }
};

export const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId).populate(
      "category",
      "name description"
    );

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return product;
  } catch (err) {
    throw err;
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const products = await Product.find({
      category: categoryId,
      archived: false,
    }).populate("category", "name");

    return products;
  } catch (err) {
    throw err;
  }
};

export const restoreProduct = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!product.archived) {
    throw new ApiError(400, "Product is not archived");
  }

  product.archived = false;
  product.isActive = true;

  await product.save();

  return product;
};

