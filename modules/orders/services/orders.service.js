import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Transaction from "../../transctions/models/transaction.models.js";
import * as cartService from "../../carts/services/cart.service.js";
import Product from "../../products/models/products.model.js";
import paystack from "../../paystackIntegrations/services/paystack.service.js";
import NicheProduct from "../../nichelab/model/product.model.js"

const KOBOS = (ngn) => Math.round(ngn * 100);

export async function createCheckout({
  cartId,
  items: bodyItems,
  customer = {},
  callbackUrl,
  expectedTotal
} = {}) {

  let orderItems = [];
  let pricing = { subtotal: 0, couponDiscount: 0, giftWrapFee: 0, total: 0 };

  /*
  ============================================
  1️⃣ CART CHECKOUT (NO CHANGE NEEDED)
  ============================================
  */
  if (cartId) {
    const cart = await cartService.getCart(cartId);
    if (!cart || cart.items.length === 0)
      throw Object.assign(new Error("Cart empty"), { statusCode: 400 });

    if (expectedTotal !== undefined) {
      await cartService.validateCartTotal(cartId, expectedTotal);
    }

    orderItems = cart.items.map(i => ({
      product: i.productId?._id || i.productId,
      productType: i.productType || "normal",   // 👈 add this if cart supports niche later
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
  }

  /*
  ============================================
  2️⃣ DIRECT ITEMS CHECKOUT (UPDATED HERE)
  ============================================
  */
  else if (Array.isArray(bodyItems) && bodyItems.length > 0) {

    for (const item of bodyItems) {

      if (!item.productId)
        throw Object.assign(new Error("productId is required"), { statusCode: 400 });

      const qty = item.qty || item.quantity || 1;

      let product;

      // 🔥 THIS IS WHERE NICHE SUPPORT HAPPENS
      if (item.productType === "niche") {
        product = await NicheProduct.findById(item.productId);
      } else {
        product = await Product.findById(item.productId);
      }

      if (!product) {
        throw Object.assign(
          new Error("Product not found: " + item.productId),
          { statusCode: 400 }
        );
      }

      orderItems.push({
        product: product._id,
        productType: item.productType || "normal",  // 👈 store it
        name: product.name,
        bottleSize: item.bottleSize,
        quantity: qty,
        unitPrice: product.price,
        subtotal: product.price * qty,
      });
    }

    const subtotal = orderItems.reduce((s, it) => s + it.subtotal, 0);

    pricing = {
      subtotal,
      couponDiscount: 0,
      giftWrapFee: 0,
      total: subtotal,
    };

    if (expectedTotal !== undefined) {
      const tolerance = 0.01;
      if (Math.abs(pricing.total - expectedTotal) > tolerance) {
        throw Object.assign(new Error("Cart total mismatch"), { statusCode: 400 });
      }
    }
  }

  else {
    throw Object.assign(new Error("No cartId or items provided"), {
      statusCode: 400,
    });
  }

  /*
  ============================================
  3️⃣ ORDER CREATION (UNCHANGED)
  ============================================
  */

  if (!pricing.total || pricing.total <= 0)
    throw Object.assign(new Error("Invalid cart total"), { statusCode: 400 });

  const order = await Order.create({
    orderId: new mongoose.Types.ObjectId().toString(),
    customer,
    orderItems,
    pricing,
    paymentStatus: "pending",
    status: "created",
  });

  const reference = `${order._id.toString()}-${Date.now()}`;

  const init = await paystack.paystackInit({
    amountKobo: KOBOS(pricing.total),
    email: customer?.email || "no-reply@wamze.local",
    reference,
    callbackUrl: callbackUrl || `${process.env.APP_BASE_URL}/payment/callback`,
    metadata: { orderId: order._id.toString() },
  });

  if (!init || !init.data) {
    // create or update transaction safely (avoid duplicate key on reference)
    await Transaction.findOneAndUpdate(
      { reference },
      {
        orderId: order._id,
        reference,
        transactionId: reference,
        amount: pricing.total,
        status: "failed",
        rawResponse: init,
      },
      { upsert: true, new: true }
    );
    throw Object.assign(new Error("Failed to initialize payment"), {
      statusCode: 500,
    });
  }

  order.payment = order.payment || {};
  order.payment.reference = init.data.reference || reference;
  await order.save();

  // create or update transaction safely to prevent duplicate-key errors on retries
  await Transaction.findOneAndUpdate(
    { reference: order.payment.reference },
    {
      orderId: order._id,
      reference: order.payment.reference,
      transactionId: order.payment.reference,
      amount: pricing.total,
      currency: "NGN",
      status: "pending",
      rawResponse: init,
    },
    { upsert: true, new: true }
  );

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
