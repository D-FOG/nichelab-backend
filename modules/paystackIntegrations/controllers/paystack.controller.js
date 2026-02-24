import crypto from "crypto";
import mongoose from "mongoose";
import Order from "../../orders/models/order.model.js";
import Transaction from "../../transctions/models/transaction.models.js";
import paystack from "../services/paystack.service.js";
import Product from "../../products/models/products.model.js";
import NicheProduct from "../../nichelab/model/product.model.js";

export const paystackWebhook = async (req, res, next) => {
  try {
    const rawBody = req.body;
    const signature = req.headers["x-paystack-signature"];

    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== hash) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(rawBody.toString());
    const reference = event.data.reference;

    // Verify with Paystack
    const verifyResp = await paystack.paystackVerify(reference);
    if (!verifyResp?.data) {
      return res.status(400).send("Unable to verify transaction");
    }

    const status = verifyResp.data.status;
    const metadataOrderId = verifyResp.data.metadata?.orderId;
    const orderId =
      metadataOrderId || verifyResp.data.reference?.split("-")[0];

    // Idempotency
    let txn = await Transaction.findOne({ reference });

    if (!txn) {
      txn = await Transaction.create({
        orderId,
        reference,
        transactionId: reference,
        amount: verifyResp.data.amount / 100,
        currency: verifyResp.data.currency,
        status,
        rawResponse: verifyResp.data,
      });
    } else {
      if (txn.status === "success" && status === "success") {
        return res.status(200).send("ok");
      }

      txn.status = status;
      txn.rawResponse = verifyResp.data;
      await txn.save();
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send("Order not found");

    if (status !== "success") {
      order.payment = {
        status: "failed",
        reference,
        gatewayResponse: verifyResp.data,
      };
      order.paymentStatus = "failed";
      await order.save();

      txn.status = "failed";
      await txn.save();

      return res.status(200).send("ok");
    }

    // If already paid
    if (order.paymentStatus === "successful") {
      return res.status(200).send("ok");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const item of order.orderItems) {
        const productId = item.product;
        const qty = item.quantity || 1;

        let Model;

        if (item.productType === "niche") {
          Model = NicheProduct;
        } else {
          Model = Product;
        }

        const result = await Model.updateOne(
          { _id: productId, stock: { $gte: qty } },
          { $inc: { stock: -qty } },
          { session }
        );

        if (result.modifiedCount === 0) {
          throw new Error(`Insufficient stock for ${productId}`);
        }
      }

      // Update order
      order.payment = {
        status: "success",
        paidAt: new Date(),
        reference,
        gatewayResponse: verifyResp.data,
      };

      order.paymentStatus = "successful";
      order.status = "processing";

      await order.save({ session });

      txn.status = "success";
      await txn.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).send("ok");
    } catch (err) {
      await session.abortTransaction();
      session.endSession();

      txn.status = "failed";
      txn.rawResponse = { ...txn.rawResponse, error: err.message };
      await txn.save();

      order.paymentStatus = "failed";
      order.status = "created";
      await order.save();

      return res.status(400).send("Stock error");
    }
  } catch (err) {
    next(err);
  }
};