import {
  getTopCategoriesBySalesPerDayService,
  getTopProductsBySalesService,
  getAdminTotalsService,
} from "../services/admin.stats.service.js";

export const getTopCategoriesBySalesPerDayController = async (req, res, next) => {
  try {
    const data = await getTopCategoriesBySalesPerDayService();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getTopProductsBySalesController = async (req, res, next) => {
  try {
    const data = await getTopProductsBySalesService();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminTotalsController = async (req, res, next) => {
  try {
    const data = await getAdminTotalsService();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};