import crypto from "crypto";
import Order from "../../orders/models/order.model.js";
import Transaction from "../../transctions/models/transaction.models.js";
import paystack from "../services/paystack.service.js";
import Product from "../../products/models/products.model.js";
import mongoose from "mongoose";

// /**
//  * Paystack webhook handler.
//  * Must be mounted with express.raw({ type: "*/}) so we get the raw body.
//  *
export const paystackWebhook = async (req, res, next) => {
  try {
    const rawBody = req.body; // raw buffer or string (express.raw provided)
    const signature = req.headers["x-paystack-signature"];

    // verify signature
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
    if (signature !== hash) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(rawBody.toString());
    const eventData = event.data;
    const reference = eventData.reference;

    // Double-check with Paystack verify endpoint
    const verifyResp = await paystack.paystackVerify(reference);
    if (!verifyResp || !verifyResp.data) {
      return res.status(400).send("Unable to verify transaction");
    }

    const status = verifyResp.data.status; // 'success' | 'failed' | 'pending'
    const metadataOrderId = verifyResp.data.metadata?.orderId;
    const orderId = metadataOrderId || verifyResp.data.reference?.split("-")[0];

    // Idempotency: find transaction
    let txn = await Transaction.findOne({ reference });
    if (!txn) {
      txn = await Transaction.create({
        orderId,
        reference,
        amount: verifyResp.data.amount / 100,
        currency: verifyResp.data.currency,
        status: status === "success" ? "success" : (status === "failed" ? "failed" : "pending"),
        rawResponse: verifyResp.data,
      });
    } else {
      // If already processed as success, ignore duplicate success webhooks
      if (txn.status === "success" && status === "success") {
        return res.status(200).send("ok");
      }
      txn.status = status === "success" ? "success" : (status === "failed" ? "failed" : "pending");
      txn.rawResponse = verifyResp.data;
      await txn.save();
    }

    // Update order and decrement stock on success
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    if (status === "success") {
      // If already marked paid, respond ok
      if (order.payment.status === "success") {
        return res.status(200).send("ok");
      }

      // Use MongoDB transaction if available for atomicity
      const session = await mongoose.startSession();
      let usedSession = false;

      try {
        // Start transaction if backed by replica set
        if (session.inTransaction === false) {
          session.startTransaction();
          usedSession = true;
        }

        // Decrement stock for each item, ensure enough stock exists
        for (const it of order.items) {
          const resUpdate = await Product.updateOne(
            { _id: it.productId, stock: { $gte: it.qty } },
            { $inc: { stock: -it.qty } },
            { session }
          );

          if (resUpdate.modifiedCount === 0) {
            // Insufficient stock — abort transaction
            throw new Error(`Insufficient stock for product ${it.productId}`);
          }
        }

        // Update order payment fields
        order.payment.status = "success";
        order.payment.paidAt = new Date();
        order.payment.gatewayResponse = verifyResp.data;
        order.status = "paid";
        await order.save({ session });

        // update txn orderId if needed
        txn.orderId = order._id;
        txn.status = "success";
        await txn.save({ session });

        if (usedSession) await session.commitTransaction();
      } catch (err) {
        if (usedSession) await session.abortTransaction();
        // mark transaction as failed and update order
        txn.status = "failed";
        txn.rawResponse = { ...txn.rawResponse, error: err.message };
        await txn.save();
        order.payment.status = "failed";
        order.status = "created";
        await order.save();
        return res.status(400).send("stock error");
      } finally {
        session.endSession();
      }

      return res.status(200).send("ok");
    } else if (status === "failed") {
      order.payment.status = "failed";
      order.payment.gatewayResponse = verifyResp.data;
      await order.save();
      txn.status = "failed";
      await txn.save();
      return res.status(200).send("ok");
    } else {
      // pending
      txn.status = "pending";
      await txn.save();
      return res.status(200).send("ok");
    }
  } catch (err) {
    next(err);
  }
};
