import * as cartService from "../services/cart.service.js";

// Get or create cart
export const getOrCreateCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await cartService.getOrCreateCart(cartId);
    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity, bottleSize } = req.body;

    if (!productId || !quantity || !bottleSize) {
      return res
        .status(400)
        .json({ error: "productId, quantity, and bottleSize are required" });
    }

    const cart = await cartService.addToCart(
      cartId,
      productId,
      quantity,
      bottleSize
    );

    return res.json({ message: "Item added to cart", cart });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Update quantity
export const updateQuantity = async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ error: "Quantity is required" });
    }

    const cart = await cartService.updateQuantity(cartId, itemId, quantity);

    return res.json({ message: "Quantity updated", cart });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Remove item
export const removeItem = async (req, res) => {
  try {
    const { cartId, itemId } = req.params;

    const cart = await cartService.removeFromCart(cartId, itemId);

    return res.json({ message: "Item removed from cart", cart });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await cartService.clearCart(cartId);

    return res.json({ message: "Cart cleared", cart });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Apply coupon
export const applyCoupon = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { couponCode } = req.body;

    if (!couponCode) {
      return res.status(400).json({ error: "Coupon code is required" });
    }

    const result = await cartService.applyCoupon(cartId, couponCode);

    return res.json({
      message: "Coupon applied successfully",
      discount: result.discount,
      cart: result.cart,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Remove coupon
export const removeCoupon = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await cartService.removeCoupon(cartId);

    return res.json({ message: "Coupon removed", cart });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Apply gift wrap
export const applyGiftWrap = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { giftWrapId } = req.body;

    if (!giftWrapId) {
      return res.status(400).json({ error: "Gift wrap ID is required" });
    }

    const cart = await cartService.applyGiftWrap(cartId, giftWrapId);

    return res.json({ message: "Gift wrap applied", cart });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Remove gift wrap
export const removeGiftWrap = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await cartService.removeGiftWrap(cartId);

    return res.json({ message: "Gift wrap removed", cart });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Get available gift wraps
export const getGiftWraps = async (req, res) => {
  try {
    const giftWraps = await cartService.getGiftWraps();
    return res.json(giftWraps);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Validate cart total
export const validateCartTotal = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { total } = req.body;

    if (total === undefined) {
      return res.status(400).json({ error: "Total amount is required" });
    }

    await cartService.validateCartTotal(cartId, total);

    return res.json({ message: "Cart total is valid" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
