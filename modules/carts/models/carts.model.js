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
});

const cartSchema = new mongoose.Schema(
  {
    cartId: { type: String, required: true, unique: true },
    items: [cartItemSchema],
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// auto-calc total
cartSchema.methods.calculateTotal = function () {
  this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export default mongoose.model("Cart", cartSchema);
