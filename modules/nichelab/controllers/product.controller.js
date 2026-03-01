import {
  createNicheProduct,
  updateNicheProduct,
  deleteNicheProduct,
  getAllNicheProducts,
  getNicheProductById,
  getNicheProductsByCategory,
  restoreNicheProduct,
} from "../services/product.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const createNicheProductController = async (req, res, next) => {
  try {
    const product = await createNicheProduct(req.body, req.files);
    res.status(201).json(new ApiResponse(201, "Product created", product));
  } catch (err) {
    next(err);
  }
};

export const updateNicheProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await updateNicheProduct(id, req.body, req.files);
    res.json(new ApiResponse(200, "Product updated", product));
  } catch (err) {
    next(err);
  }
};

export const deleteNicheProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await deleteNicheProduct(id);
    res.json(new ApiResponse(200, "Product deleted", product));
  } catch (err) {
    next(err);
  }
};

export const getAllNicheProductsController = async (req, res, next) => {
  try {
    const products = await getAllNicheProducts(req.query);
    res.json(new ApiResponse(200, "OK", products));
  } catch (err) {
    next(err);
  }
};

export const getNicheProductByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await getNicheProductById(id);
    res.json(new ApiResponse(200, "OK", product));
  } catch (err) {
    next(err);
  }
};

export const getNicheProductsByCategoryController = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const products = await getNicheProductsByCategory(categoryId);
    res.json(new ApiResponse(200, "OK", products));
  } catch (err) {
    next(err);
  }
};

export const restoreNicheProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await restoreNicheProduct(id);
    res.json(new ApiResponse(200, "Product restored", product));
  } catch (err) {
    next(err);
  } 
};