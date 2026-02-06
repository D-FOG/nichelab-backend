import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    maxUses: {
      type: Number,
      default: null, // null = unlimited
    },
    currentUses: {
      type: Number,
      default: 0,
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Check if coupon is still valid
couponSchema.methods.isValid = function () {
  if (!this.isActive) return false;
  if (this.maxUses && this.currentUses >= this.maxUses) return false;
  if (this.expiryDate && new Date() > this.expiryDate) return false;
  return true;
};

// Calculate discount amount
couponSchema.methods.calculateDiscount = function (amount) {
  if (this.discountType === "percentage") {
    return (amount * this.discountValue) / 100;
  } else {
    return this.discountValue;
  }
};

export default mongoose.model("Coupon", couponSchema);
