import mongoose from "mongoose";

const nicheProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    description: { type: String, required: true },

    price: { type: Number, required: true, min: 0 },

    bottleSize: {
      type: String,
      enum: ["30ml", "50ml", "75ml", "100ml"],
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NicheCategory",
      required: true,
    },

    stock: { type: Number, required: true, min: 0 },

    tags: {
      type: [String],
      enum: ["unisex", "masculine", "feminine"],
      default: [],
    },

    images: [
      {
        publicId: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],

    ratings: [
      {
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
      },
    ],

    likedBy: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },

    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Virtuals
nicheProductSchema.virtual("inStock").get(function () {
  return this.stock > 0;
});

nicheProductSchema.virtual("averageRating").get(function () {
  if (!this.ratings.length) return 0;
  const total = this.ratings.reduce((s, r) => s + r.rating, 0);
  return Math.round((total / this.ratings.length) * 10) / 10;
});


// Check if product is sold out
nicheProductSchema.virtual("soldOut").get(function () {
  return this.stock === 0;
});

nicheProductSchema.virtual("likesCount").get(function () {
  return this.likedBy;
});

nicheProductSchema.set("toJSON", { virtuals: true });

export default mongoose.model("NicheProduct", nicheProductSchema);