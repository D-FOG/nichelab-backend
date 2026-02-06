import Cart from "../models/carts.model.js";
import Product from "../../products/models/products.model.js";
import Coupon from "../models/coupon.model.js";
import GiftWrap from "../models/giftWrap.model.js";

/**
 * Get or create cart
 */
export const getOrCreateCart = async (cartId) => {
  let cart = await Cart.findOne({ cartId }).populate("giftWrap.id");

  if (!cart) {
    cart = await Cart.create({ cartId, items: [], pricing: {} });
  }

  cart.calculateTotal();
  return cart;
};

/**
 * Add item to cart with quantity
 */
export const addToCart = async (cartId, productId, quantity, bottleSize) => {
  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  if (!product.inStock) {
    throw new Error("Product is out of stock");
  }

  if (product.stock < quantity) {
    throw new Error(`Only ${product.stock} items available`);
  }

  let cart = await Cart.findOne({ cartId });
  if (!cart) {
    cart = await Cart.create({ cartId, items: [], pricing: {} });
  }

  // Check if item already exists
  const existingItem = cart.items.find(
    (item) =>
      item.productId.toString() === productId &&
      item.bottleSize === bottleSize
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      quantity,
      bottleSize,
      price: product.price,
      productName: product.name,
      productImage: product.images?.[0]?.url || null,
    });
  }

  cart.calculateTotal();
  await cart.save();

  return cart;
};

/**
 * Update item quantity
 */
export const updateQuantity = async (cartId, itemId, quantity) => {
  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ cartId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.id(itemId);
  if (!item) {
    throw new Error("Item not found in cart");
  }

  // Verify stock availability
  const product = await Product.findById(item.productId);
  if (product.stock < quantity) {
    throw new Error(`Only ${product.stock} items available`);
  }

  item.quantity = quantity;
  cart.calculateTotal();
  await cart.save();

  return cart;
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (cartId, itemId) => {
  const cart = await Cart.findOne({ cartId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);
  if (itemIndex === -1) {
    throw new Error("Item not found in cart");
  }

  cart.items.splice(itemIndex, 1);
  cart.calculateTotal();
  await cart.save();

  return cart;
};

/**
 * Clear entire cart
 */
export const clearCart = async (cartId) => {
  const cart = await Cart.findOne({ cartId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = [];
  cart.coupon = {};
  cart.giftWrap = {};
  cart.pricing = { subtotal: 0, couponDiscount: 0, giftWrapFee: 0, total: 0 };

  await cart.save();
  return cart;
};

/**
 * Apply coupon to cart
 */
export const applyCoupon = async (cartId, couponCode) => {
  const cart = await Cart.findOne({ cartId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  if (cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
  });

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  if (!coupon.isValid()) {
    throw new Error("Coupon is no longer valid");
  }

  if (cart.subtotal < coupon.minPurchaseAmount) {
    throw new Error(
      `Minimum purchase amount of ${coupon.minPurchaseAmount} required`
    );
  }

  // Calculate discount
  const discountAmount = coupon.calculateDiscount(cart.subtotal);

  cart.coupon = {
    code: coupon.code,
    discountAmount,
  };

  // Increment coupon usage
  coupon.currentUses += 1;
  await coupon.save();

  cart.calculateTotal();
  await cart.save();

  return {
    cart,
    discount: discountAmount,
  };
};

/**
 * Remove coupon from cart
 */
export const removeCoupon = async (cartId) => {
  const cart = await Cart.findOne({ cartId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  if (cart.coupon?.code) {
    // Decrement coupon usage if it was applied
    const coupon = await Coupon.findOne({ code: cart.coupon.code });
    if (coupon) {
      coupon.currentUses = Math.max(0, coupon.currentUses - 1);
      await coupon.save();
    }
  }

  cart.coupon = {};
  cart.calculateTotal();
  await cart.save();

  return cart;
};

/**
 * Apply gift wrap to cart
 */
export const applyGiftWrap = async (cartId, giftWrapId) => {
  const cart = await Cart.findOne({ cartId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  const giftWrap = await GiftWrap.findById(giftWrapId);
  if (!giftWrap) {
    throw new Error("Gift wrap not found");
  }

  if (!giftWrap.isActive) {
    throw new Error("This gift wrap is no longer available");
  }

  cart.giftWrap = {
    id: giftWrap._id,
    name: giftWrap.name,
    price: giftWrap.price,
  };

  cart.calculateTotal();
  await cart.save();

  return cart;
};

/**
 * Remove gift wrap from cart
 */
export const removeGiftWrap = async (cartId) => {
  const cart = await Cart.findOne({ cartId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.giftWrap = {};
  cart.calculateTotal();
  await cart.save();

  return cart;
};

/**
 * Get all available gift wraps
 */
export const getGiftWraps = async () => {
  return await GiftWrap.find({ isActive: true });
};

/**
 * Validate cart total (prevent frontend manipulation)
 */
export const validateCartTotal = async (cartId, expectedTotal) => {
  const cart = await Cart.findOne({ cartId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.calculateTotal();
  const actualTotal = cart.pricing.total;

  // Allow small floating point differences
  const tolerance = 0.01;
  if (Math.abs(actualTotal - expectedTotal) > tolerance) {
    throw new Error(
      `Cart total mismatch. Expected: ${expectedTotal}, Actual: ${actualTotal}`
    );
  }

  return true;
};

/**
 * Get cart with full details
 */
export const getCart = async (cartId) => {
  const cart = await Cart.findOne({ cartId })
    .populate("items.productId")
    .populate("giftWrap.id");

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.calculateTotal();
  return cart;
};
