import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["created", "pending", "processing", "shipped", "delivered", "cancelled"],
      default: "created",
    },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String },
        bottleSize: { type: String },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true },
        subtotal: { type: Number, required: true },
      },
    ],

    pricing: {
      subtotal: { type: Number, required: true },
      couponDiscount: { type: Number, default: 0 },
      giftWrapFee: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },

    payment: {
      reference: { type: String },
      status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
      gatewayResponse: { type: mongoose.Schema.Types.Mixed },
      paidAt: { type: Date },
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "successful", "failed"],
      default: "pending",
    },

    // Customer details and addresses
    customer: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },
      phone: { type: String },
      deliveryType: { type: String, enum: ["ship", "pickup"], default: "ship" },
      saveInfo: { type: Boolean, default: false },
      shippingAddress: {
        company: { type: String },
        address1: { type: String },
        address2: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
      },
      billingAddress: {
        company: { type: String },
        address1: { type: String },
        address2: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
      },
    },
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
