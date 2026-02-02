import { createProduct, updateProduct, deleteProduct, getAllProducts, getProductById, getProductsByCategory} from "../services/product.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const createProductController = async (req, res, next) => {
    try {
        const { name, description, price, bottleSize, categoryId, stock, tags } = req.body;
        const product = await createProduct(name, description, price, bottleSize, categoryId, stock, tags, req.files);
        return res.status(201).json(new ApiResponse(201, "Product created successfully", product));
    } catch (err) {
        next(err);
    }   
};

export const updateProductController = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const updateData = req.body;
        const product = await updateProduct(productId, updateData, req.files);
        return res.status(200).json(new ApiResponse(200, "Product updated successfully", product));
    }
    catch (err) {
        next(err);
    }
};

export const deleteProductController = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await deleteProduct(productId);
        return res.status(200).json(new ApiResponse(200, "Product deleted successfully", product));
    } catch (err) {
        next(err);
    }
};

export const getAllProductsController = async (req, res, next) => {
    try {
        const { search, categoryId, tag, archived } = req.query; 
        const products = await getAllProducts(search, categoryId, tag, archived)
        return res.status(200).json(new ApiResponse(200, "Products fetched successfully", products))
    } catch (err) {
          next(err)
    }
};

export const getProductByIdController = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await getProductById(productId);
        return res.status(200).json(new ApiResponse(200, "Product fetched successfully", product));
    } catch (err) {
        next(err);
    }
};

export const getProductsByCategoryController = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const products = await getProductsByCategory(categoryId);
        return res.status(200).json(new ApiResponse(200, "Products fetched successfully", products));
    } catch (err) {
        next(err);
    }
};