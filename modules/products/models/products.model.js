import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    description: { type: String, required: true },

    price: { type: Number, required: true },

    bottleSize: {
      type: String,
      enum: ["30ml", "50ml", "75ml", "100ml"],
      required: true,
    },

    category: {
      type: String,
      enum: ["testers", "unboxed", "oil_perfumes", "key_icon_niche_lab"],
      required: true,
    },

    tags: {
      type: [String],
      enum: ["unisex", "masculine", "feminine"],
      default: [],
    },

    stock: { type: Number, required: true, min: 0 },

    images: { type: [String], default: [] },

    archived: { type: Boolean, default: false },

    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// auto-update inStock
productSchema.pre("save", function (next) {
  this.inStock = this.stock > 0;
  next();
});

export default mongoose.model("Product", productSchema);
