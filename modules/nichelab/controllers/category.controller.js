import {
	createNicheCategory,
	getAllNicheCategories,
	getNicheCategoryById,
	updateCategoryById,
	deleteNicheCategory,
} from "../services/category.services.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const createNicheCategoryController = async (req, res, next) => {
	try {
		const category = await createNicheCategory(req.body);
		res.status(201).json(new ApiResponse(201, "Category created", category));
	} catch (err) {
		next(err);
	}
};

export const getAllNicheCategoriesController = async (req, res, next) => {
	try {
		const categories = await getAllNicheCategories();
		res.json(new ApiResponse(200, "OK", categories));
	} catch (err) {
		next(err);
	}
};

export const getNicheCategoryByIdController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const category = await getNicheCategoryById(id);
		res.json(new ApiResponse(200, "OK", category));
	} catch (err) {
		next(err);
	}
};

export const updateNicheCategoryController = async (req, res, next) => {
	try {
		const { id } = req.params;
		// support optional single file upload under `image`
		const filePath = req.file?.path;
		const updated = await updateCategoryById(id, req.body, filePath);
		res.json(new ApiResponse(200, "Category updated", updated));
	} catch (err) {
		next(err);
	}
};

export const deleteNicheCategoryController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const cat = await deleteNicheCategory(id);
		res.json(new ApiResponse(200, "Category deleted", cat));
	} catch (err) {
		next(err);
	}
};
