import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      isDiscounted: { type: Boolean, default: false },
      percentage: { type: Number, min: 0, max: 100, default: 0 },
    },

    bottleSize: {
      type: String,
      enum: ["30ml", "50ml", "75ml", "100ml"],
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    tags: {
      type: [String],
      enum: ["unisex", "masculine", "feminine"],
      default: [],
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    images: [
      {
        publicId: { type: String, required: true },
        url: { type: String, required: true },
      }
    ],

    ratings: [
      {
        // userId: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "User",
        // },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: { type: String },
      },
    ],

    likedBy: [
      {
        type: Number,
        default: 0,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "User",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// auto update stock status
productSchema.virtual("inStock").get(function () {
  return this.stock > 0;
});

// Calculate average rating
productSchema.virtual("averageRating").get(function () {
  if (this.ratings.length === 0) return 0;
  const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / this.ratings.length) * 10) / 10; // round to 1 decimal
});

// Check if product is sold out
productSchema.virtual("soldOut").get(function () {
  return this.stock === 0;
});

// Get total likes count
productSchema.virtual("likesCount").get(function () {
  return this.likedBy.length;
});

productSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Product", productSchema);


// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },

//     description: { type: String, required: true },

//     price: { type: Number, required: true },

//     bottleSize: {
//       type: String,
//       enum: ["30ml", "50ml", "75ml", "100ml"],
//       required: true,
//     },

//     category: {
//       type: String,
//       enum: ["testers", "unboxed", "oil_perfumes", "key_icon_niche_lab"],
//       required: true,
//     },

//     tags: {
//       type: [String],
//       enum: ["unisex", "masculine", "feminine"],
//       default: [],
//     },

//     stock: { type: Number, required: true, min: 0 },

//     images: { type: [String], default: [] },

//     archived: { type: Boolean, default: false },

//     inStock: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// // auto-update inStock
// productSchema.pre("save", function (next) {
//   this.inStock = this.stock > 0;
//   next();
// });

// export default mongoose.model("Product", productSchema);

// look at this model controller and service again and update the service the ratings and like should be among
// the model
// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     discount: {
//       isDiscounted: { type: Boolean, default: false },
//       percentage: { type: Number, min: 0, max: 100, default: 0 },
//     },

//     bottleSize: {
//       type: String,
//       enum: ["30ml", "50ml", "75ml", "100ml"],
//       required: true,
//     },

//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },

//     tags: {
//       type: [String],
//       enum: ["unisex", "masculine", "feminine"],
//       default: [],
//     },

//     stock: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     images: [
//       {
//         publicId: { type: String, required: true },
//         url: { type: String, required: true },
//       }
//     ],

//     ratings: [
//       {
//         // userId: {
//         //   type: mongoose.Schema.Types.ObjectId,
//         //   ref: "User",
//         // },
//         rating: {
//           type: Number,
//           min: 1,
//           max: 5,
//         },
//         comment: { type: String },
//       },
//     ],

//     likedBy: [
//       {
//         type: Number,
//         default: 0,
//         // type: mongoose.Schema.Types.ObjectId,
//         // ref: "User",
//       },
//     ],

//     isActive: {
//       type: Boolean,
//       default: true,
//     },

//     archived: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// // auto update stock status
// productSchema.virtual("inStock").get(function () {
//   return this.stock > 0;
// });

// // Calculate average rating
// productSchema.virtual("averageRating").get(function () {
//   if (this.ratings.length === 0) return 0;
//   const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
//   return Math.round((total / this.ratings.length) * 10) / 10; // round to 1 decimal
// });

// // Check if product is sold out
// productSchema.virtual("soldOut").get(function () {
//   return this.stock === 0;
// });

// // Get total likes count
// productSchema.virtual("likesCount").get(function () {
//   return this.likedBy.length;
// });

// productSchema.set("toJSON", { virtuals: true });

// export default mongoose.model("Product", productSchema);



// the service
// export const getProductById = async (productId) => {
//   const product = await Product.findById(productId)
//     .populate("category", "name")
//     .populate("name email");

//   if (!product) {
//     throw new Error("Product not found");
//   }

//   return product;
// };

// the controller
// export const getProduct = async (req, res) => {
//   try {
//     const product = await productService.getProductById(req.params.id);
//     return res.json(product);
//   } catch (err) {
//     return res.status(404).json({ error: err.message });
//   }
// };