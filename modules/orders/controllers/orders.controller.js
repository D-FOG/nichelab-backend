import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Transaction from "../../transctions/models/transaction.models.js";
import Cart from "../../carts/models/carts.model.js";
import Product from "../../products/models/products.model.js";
import paystack from "../../../services/paystack.service.js";

const KOBOS = (ngn) => Math.round(ngn * 100);

// POST /api/checkout
export const createCheckout = async (req, res, next) => {
  try {
    const { cartId, items: bodyItems, customer, callbackUrl } = req.body;

    // Build items either from cart or from body
    let items = [];
    if (cartId) {
      const cart = await Cart.findOne({ cartId }).populate("items.productId");
      if (!cart || cart.items.length === 0) return res.status(400).json({ error: "Cart empty" });

      items = cart.items.map(i => ({
        productId: i.productId._id,
        name: i.productId.name,
        bottleSize: i.bottleSize,
        unitPrice: i.productId.price,
        qty: i.quantity,
        subtotal: i.productId.price * i.quantity,
      }));
    } else if (Array.isArray(bodyItems) && bodyItems.length > 0) {
      // Validate provided items: must contain productId, bottleSize, qty
      const productIds = bodyItems.map(i => i.productId);
      const products = await Product.find({ _id: { $in: productIds } });
      const productMap = new Map(products.map(p => [p._id.toString(), p]));
      items = bodyItems.map(i => {
        const p = productMap.get(i.productId);
        if (!p) throw new Error("Product not found: " + i.productId);
        return {
          productId: p._id,
          name: p.name,
          bottleSize: i.bottleSize,
          unitPrice: p.price,
          qty: i.qty,
          subtotal: p.price * i.qty,
        };
      });
    } else {
      return res.status(400).json({ error: "No cartId or items provided" });
    }

    // Compute total and validate stock
    const total = items.reduce((s, it) => s + it.subtotal, 0);
    if (total <= 0) return res.status(400).json({ error: "Invalid cart total" });

    // Create order with pending payment
    const order = await Order.create({
      customer,
      items,
      total,
      currency: "NGN",
      payment: { status: "pending" },
      status: "created",
    });

    // Initialize Paystack transaction
    const reference = `${order._id.toString()}-${Date.now()}`;
    const init = await paystack.paystackInit({
      amountKobo: KOBOS(total),
      email: customer?.email || "no-reply@wamze.local",
      reference,
      callbackUrl: callbackUrl || `${process.env.APP_BASE_URL}/payment/callback`,
      metadata: { orderId: order._id.toString() },
    });

    if (!init || !init.data) {
      // record transaction as failed
      await Transaction.create({
        orderId: order._id,
        reference,
        amount: total,
        status: "failed",
        rawResponse: init,
      });
      return res.status(500).json({ error: "Failed to initialize payment" });
    }

    // Save transaction and reference
    order.payment.reference = init.data.reference || reference;
    await order.save();

    await Transaction.create({
      orderId: order._id,
      reference: order.payment.reference,
      amount: total,
      currency: "NGN",
      status: "pending",
      rawResponse: init,
    });

    // Return authorization url & order id to frontend
    return res.status(201).json({
      authorization_url: init.data.authorization_url,
      reference: order.payment.reference,
      orderId: order._id,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:ids
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.json(order);
  } catch (err) {
    next(err);
  }
};
