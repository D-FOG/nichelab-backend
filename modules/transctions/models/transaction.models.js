import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    amount: { type: Number, required: true },
    method: { type: String, default: "paystack" },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);

// import mongoose from "mongoose";

// const transactionSchema = new mongoose.Schema({
//   orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
//   reference: { type: String, required: true, unique: true },
//   amount: { type: Number, required: true },
//   currency: { type: String, default: "NGN" },
//   status: { type: String, enum: ["pending", "success", "failed"], required: true },
//   channel: String,
//   message: String,
//   rawResponse: mongoose.Schema.Types.Mixed,
// }, { timestamps: true });

// export default mongoose.model("Transaction", transactionSchema);

