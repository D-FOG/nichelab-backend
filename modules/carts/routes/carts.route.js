import express from "express";
import {
  getOrCreateCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
  applyCoupon,
  removeCoupon,
  applyGiftWrap,
  removeGiftWrap,
  getGiftWraps,
  validateCartTotal,
} from "../controllers/carts.controller.js";

const router = express.Router();

// Public — cartId is generated client-side
router.get("/:cartId", getOrCreateCart);
router.get("/:cartId/gift-wraps", getGiftWraps);

router.post("/:cartId/add", addToCart);
router.patch("/:cartId/item/:itemId", updateQuantity);
router.delete("/:cartId/item/:itemId", removeItem);
router.delete("/:cartId/clear", clearCart);

// Coupon operations
router.post("/:cartId/coupon/apply", applyCoupon);
router.delete("/:cartId/coupon", removeCoupon);

// Gift wrap operations
router.post("/:cartId/gift-wrap/apply", applyGiftWrap);
router.delete("/:cartId/gift-wrap", removeGiftWrap);

// Validation
router.post("/:cartId/validate", validateCartTotal);

export default router;
