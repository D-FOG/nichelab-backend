import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Transaction from "../../transctions/models/transaction.models.js";
import * as cartService from "../../carts/services/cart.service.js";
import Product from "../../products/models/products.model.js";
import paystack from "../../paystackIntegrations/services/paystack.service.js";

const KOBOS = (ngn) => Math.round(ngn * 100);

export async function createCheckout({ cartId, items: bodyItems, customer = {}, callbackUrl, expectedTotal } = {}) {
  // Build items and pricing snapshot from cart or body
  let orderItems = [];
  let pricing = { subtotal: 0, couponDiscount: 0, giftWrapFee: 0, total: 0 };

  if (cartId) {
    // use cart service to get full cart
    const cart = await cartService.getCart(cartId);
    if (!cart || cart.items.length === 0) throw Object.assign(new Error("Cart empty"), { statusCode: 400 });

    // Validate expected total if provided to avoid manipulation
    if (expectedTotal !== undefined) {
      await cartService.validateCartTotal(cartId, expectedTotal);
    }

    orderItems = cart.items.map(i => ({
      product: i.productId?._id || i.productId,
      name: i.productName || i.productId?.name,
      bottleSize: i.bottleSize,
      quantity: i.quantity,
      unitPrice: i.price,
      subtotal: i.price * i.quantity,
    }));

    pricing = {
      subtotal: cart.pricing.subtotal || cart.subtotal || 0,
      couponDiscount: cart.pricing.couponDiscount || 0,
      giftWrapFee: cart.pricing.giftWrapFee || 0,
      total: cart.pricing.total || 0,
    };
  } else if (Array.isArray(bodyItems) && bodyItems.length > 0) {
    // Validate provided items: must contain productId, bottleSize, qty
    const productIds = bodyItems.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    orderItems = bodyItems.map(i => {
      const p = productMap.get(i.productId);
      if (!p) throw Object.assign(new Error("Product not found: " + i.productId), { statusCode: 400 });
      const qty = i.qty || i.quantity || 1;
      return {
        product: p._id,
        name: p.name,
        bottleSize: i.bottleSize,
        quantity: qty,
        unitPrice: p.price,
        subtotal: p.price * qty,
      };
    });

    const subtotal = orderItems.reduce((s, it) => s + it.subtotal, 0);
    pricing = { subtotal, couponDiscount: 0, giftWrapFee: 0, total: subtotal };

    if (expectedTotal !== undefined) {
      // validate expected total against computed
      const tolerance = 0.01;
      if (Math.abs(pricing.total - expectedTotal) > tolerance) {
        throw Object.assign(new Error("Cart total mismatch"), { statusCode: 400 });
      }
    }
  } else {
    throw Object.assign(new Error("No cartId or items provided"), { statusCode: 400 });
  }

  // Ensure total is positive
  if (!pricing.total || pricing.total <= 0) throw Object.assign(new Error("Invalid cart total"), { statusCode: 400 });

  // Create order with pending payment and snapshot of cart
  const order = await Order.create({
    orderId: new mongoose.Types.ObjectId().toString(),
    customer: customer,
    orderItems,
    pricing,
    paymentStatus: "pending",
    status: "created",
  });

  // Initialize Paystack transaction
  console.log("PAYSTACK KEY EXISTS:", !!process.env.PAYSTACK_SECRET_KEY);
  console.log(
    "PAYSTACK KEY PREFIX:",
    process.env.PAYSTACK_SECRET_KEY?.slice(0, 7)
  );
  const reference = `${order._id.toString()}-${Date.now()}`;
  const init = await paystack.paystackInit({
    amountKobo: KOBOS(pricing.total),
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
      amount: pricing.total,
      status: "failed",
      rawResponse: init,
    });
    throw Object.assign(new Error("Failed to initialize payment"), { statusCode: 500 });
  }

  // Save transaction reference
  order.payment = order.payment || {};
  order.payment.reference = init.data.reference || reference;
  await order.save();

  await Transaction.create({
    orderId: order._id,
    reference: order.payment.reference,
    amount: pricing.total,
    currency: "NGN",
    status: "pending",
    rawResponse: init,
  });

  return {
    authorization_url: init.data.authorization_url,
    reference: order.payment.reference,
    orderId: order._id,
  };
}

export async function getOrder(orderId) {
  const order = await Order.findById(orderId).lean();
  if (!order) throw Object.assign(new Error("Order not found"), { statusCode: 404 });
  return order;
}

export default {
  createCheckout,
  getOrder,
};
