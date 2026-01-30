import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String }, // optional, for receipts
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    totalAmount: { type: Number, required: true },
    profit: { type: Number, default: 0 },

    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],

    paymentStatus: {
      type: String,
      enum: ["pending", "successful", "failed"],
      default: "pending",
    },

    shippingAddress: { type: String }, // optional for later
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

// import mongoose from "mongoose";

// const orderItemSchema = new mongoose.Schema({
//   productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//   name: { type: String, required: true },
//   bottleSize: { type: String, required: true },
//   unitPrice: { type: Number, required: true },
//   qty: { type: Number, required: true, min: 1 },
//   subtotal: { type: Number, required: true },
// });

// const orderSchema = new mongoose.Schema({
//   customer: {
//     name: String,
//     email: String,
//     phone: String,
//     address: String,
//   },
//   items: [orderItemSchema],
//   total: { type: Number, required: true },
//   currency: { type: String, default: "NGN" },
//   payment: {
//     reference: String,
//     status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
//     gatewayResponse: mongoose.Schema.Types.Mixed,
//     paidAt: Date,
//   },
//   status: { type: String, enum: ["created", "paid", "cancelled"], default: "created" },
//   archived: { type: Boolean, default: false },
// }, { timestamps: true });

// export default mongoose.model("Order", orderSchema);
