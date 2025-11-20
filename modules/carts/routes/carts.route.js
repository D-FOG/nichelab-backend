import express from "express";
import {
  getOrCreateCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
} from "../controllers/carts.controller.js";

const router = express.Router();

// Public — cartId is generated client-side
router.get("/cart/:cartId", getOrCreateCart);
router.post("/cart/:cartId/add", addToCart);
router.patch("/cart/:cartId/item/:itemId", updateQuantity);
router.delete("/cart/:cartId/item/:itemId", removeItem);
router.delete("/cart/:cartId/clear", clearCart);

export default router;
