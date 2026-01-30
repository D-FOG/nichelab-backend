// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const adminSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
//   },
//   { timestamps: true }
// );

// adminSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// export default mongoose.model("Admin", adminSchema);

import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["superadmin", "admin"],
      default: "admin",
    },

    permissions: {
      type: [String],
      default: [], // future-proof
    },

    avatar: {
      type: String, // cloudinary url
    },

    lastSeen: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
