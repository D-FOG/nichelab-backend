import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  bottleSize: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String,
  },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  currency: { type: String, default: "NGN" },
  payment: {
    reference: String,
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    gatewayResponse: mongoose.Schema.Types.Mixed,
    paidAt: Date,
  },
  status: { type: String, enum: ["created", "paid", "cancelled"], default: "created" },
  archived: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
