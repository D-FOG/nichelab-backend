import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  resetCouponUsage,
} from "../controllers/coupon.controller.js";
import {
  createGiftWrap,
  getAllGiftWraps,
  getGiftWrap,
  updateGiftWrap,
  deleteGiftWrap,
} from "../controllers/giftWrap.controller.js";
import { adminAuth } from "../../../middlewares/adminAuth.js";

const router = express.Router();

// Coupon routes (Admin only)
router.post("/coupons", adminAuth, createCoupon);
router.get("/coupons", adminAuth, getAllCoupons);
router.get("/coupons/:id", adminAuth, getCoupon);
router.put("/coupons/:id", adminAuth, updateCoupon);
router.delete("/coupons/:id", adminAuth, deleteCoupon);
router.patch("/coupons/:id/reset-usage", adminAuth, resetCouponUsage);

// Gift wrap routes (Admin only)
router.post("/gift-wraps", adminAuth, createGiftWrap);
router.get("/gift-wraps", adminAuth, getAllGiftWraps);
router.get("/gift-wraps/:id", adminAuth, getGiftWrap);
router.put("/gift-wraps/:id", adminAuth, updateGiftWrap);
router.delete("/gift-wraps/:id", adminAuth, deleteGiftWrap);

export default router;
