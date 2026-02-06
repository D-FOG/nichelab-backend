import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  bottleSize: { type: String, required: true },
  price: { type: Number, required: true },
  productName: { type: String },
  productImage: { type: String },
});

const cartSchema = new mongoose.Schema(
  {
    cartId: { type: String, required: true, unique: true },
    items: [cartItemSchema],
    subtotal: { type: Number, default: 0 },
    coupon: {
      code: { type: String },
      discountAmount: { type: Number, default: 0 },
    },
    giftWrap: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "GiftWrap" },
      name: { type: String },
      price: { type: Number, default: 0 },
    },
    pricing: {
      subtotal: { type: Number, default: 0 },
      couponDiscount: { type: Number, default: 0 },
      giftWrapFee: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Calculate cart subtotal (items only)
cartSchema.methods.calculateSubtotal = function () {
  this.subtotal = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  this.pricing.subtotal = this.subtotal;
  return this.subtotal;
};

// Calculate total with discounts and fees
cartSchema.methods.calculateTotal = function () {
  this.calculateSubtotal();

  const couponDiscount = this.coupon?.discountAmount || 0;
  const giftWrapFee = this.giftWrap?.price || 0;

  this.pricing.couponDiscount = couponDiscount;
  this.pricing.giftWrapFee = giftWrapFee;

  this.pricing.total =
    this.subtotal - couponDiscount + giftWrapFee;

  // Ensure total is not negative
  if (this.pricing.total < 0) {
    this.pricing.total = 0;
  }

  return this.pricing.total;
};

cartSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Cart", cartSchema);
