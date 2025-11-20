import Cart from "../models/carts.model.js";
import Product from "../../products/models/products.model.js";

// Create or get existing cart
export const getOrCreateCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    let cart = await Cart.findOne({ cartId }).populate("items.productId");

    if (!cart) {
      cart = await Cart.create({ cartId, items: [] });
    }

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

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    let cart = await Cart.findOne({ cartId });
    if (!cart) cart = await Cart.create({ cartId, items: [] });

    const existing = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.bottleSize === bottleSize
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        bottleSize,
        price: product.price,
      });
    }

    cart.calculateTotal();
    await cart.save();

    return res.json({ message: "Added to cart", cart });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update quantity
export const updateQuantity = async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.quantity = quantity;

    cart.calculateTotal();
    await cart.save();

    return res.json({ message: "Quantity updated", cart });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Remove item
export const removeItem = async (req, res) => {
  try {
    const { cartId, itemId } = req.params;

    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter((item) => item.id !== itemId);

    cart.calculateTotal();
    await cart.save();

    return res.json({ message: "Item removed", cart });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = [];
    cart.total = 0;

    await cart.save();

    return res.json({ message: "Cart cleared", cart });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
