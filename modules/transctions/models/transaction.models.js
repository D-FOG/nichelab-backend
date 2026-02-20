import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    // A separate transactionId field (kept in sync with payment provider reference)
    transactionId: { type: String, index: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    reference: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "NGN" },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    channel: { type: String },
    message: { type: String },
    rawResponse: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);

