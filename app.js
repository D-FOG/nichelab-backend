import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimiter from "./middlewares/rateLimit.js";
import adminRoutes from "./modules/Admin/routes/admin.route.js";
import productRoutes from "./modules/products/routes/product.route.js";
import cartRoute from "./modules/carts/routes/carts.route.js";
import orderRoutes from "./modules/orders/routes/orders.routes.js";
import admincategoryRoutes from "./modules/Admin/routes/category.route.js";
import adminProductRoutes from "./modules/Admin/routes/product.route.js";
import adminOrderRoutes from "./modules/Admin/routes/order.routes.js";
import adminTransactionRoutes from "./modules/Admin/routes/transaction.routes.js";
import paystackService from "./modules/paystackIntegrations/services/paystack.service.js";
import errorHandler from "./middlewares/error.js";

const app = express();

// Global Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(rateLimiter);


// Mount webhook with raw parser specifically
app.post(
  "/api/payments/paystack/webhook",
  express.raw({ type: "*/*" }),
  (req, res, next) => {
    // delegate to controller
    // require the controller here to avoid circular issues
    import("./src/modules/payments/paystack.controller.js").then(mod => {
      return mod.paystackWebhook(req, res, next);
    }).catch(next);
  }
);

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoute);
app.use("/api", orderRoutes);
app.use("/api", admincategoryRoutes);
app.use("/api", adminProductRoutes);
app.use("/api", adminOrderRoutes);
app.use("/api", adminTransactionRoutes);

// Error Handler
//app.use(errorHandler);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});


export default app;
