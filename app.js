import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimiter from "./middlewares/rateLimit.js";
import adminRoutes from "./modules/Admin/routes/admin.route.js";
import productRoutes from "./modules/products/routes/product.route.js";
import cartRoute from "./modules/carts/routes/carts.route.js";
import cartAdminRoute from "./modules/carts/routes/admin.route.js";
import orderRoutes from "./modules/orders/routes/orders.routes.js";
import admincategoryRoutes from "./modules/Admin/routes/category.route.js";
import adminProductRoutes from "./modules/Admin/routes/product.route.js";
import adminOrderRoutes from "./modules/Admin/routes/order.routes.js";
import adminTransactionRoutes from "./modules/Admin/routes/transaction.routes.js";
import paystackService from "./modules/paystackIntegrations/services/paystack.service.js";
import errorHandler from "./middlewares/error.js";
import swaggerUi from "swagger-ui-express";
import { getSpec } from "./config/swagger.js";
//import { setupAdminSwagger } from "./modules/Admin/swaggerSetup.js";
import adminSpec from "./modules/Admin/swagger.js";
import productSpec from "./modules/products/swagger.js";
import { cartSpec, couponGiftWrapSpec } from "./modules/carts/swagger.js";
import ordersSpec from "./modules/orders/swagger.js";
import paystackSpec from "./modules/paystackIntegrations/swagger.js";
import transactionsSpec from "./modules/Admin/swagger.transactions.js";
import nichelabSpec from "./modules/nichelab/swagger.js";
import contactSpec from "./modules/contact/swagger.js";
import adminStats from "./modules/Admin/routes/admin.stats.routes.js"
import nichelabRoute from "./modules/nichelab/routes/nichelab.route.js"
import nichelabAdminRoute from "./modules/nichelab/routes/nichelabAdmin.route.js"
import contactRoute from "./modules/contact/routes/contact.route.js"
import contactAdminRoute from './modules/contact/routes/contactAdmin.route.js'

const app = express();

// Global Middlewares
// Configure CORS to allow frontend origin, credentials and required headers
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || true,
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-paystack-signature", "X-Requested-With"],
  exposedHeaders: ["Authorization", "x-paystack-signature"],
};
app.use(cors(corsOptions));
// Preflight is handled by the global `cors` middleware; explicit
// `app.options()` caused path-to-regexp parsing errors and was removed.
app.use(helmet());
app.use(morgan("dev"));

// Mount webhook with raw parser specifically
app.post(
  "/api/payments/paystack/webhook",
  express.raw({ type: "application/json" }),
  async (req, res, next) => {
    try {
      const mod = await import(
        "./modules/paystackIntegrations/controllers/paystack.controller.js"
      );
      return mod.paystackWebhook(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

app.use(express.json());
app.use(rateLimiter);


// Mount webhook with raw parser specifically
// app.post(
//   "/api/payments/paystack/webhook",
//   express.raw({ type: "*/*" }),
//   (req, res, next) => {
//     // delegate to controller
//     // require the controller here to avoid circular issues
//     import("./modules/paystackIntegrations/controllers/paystack.controller.js").then(mod => {
//       return mod.paystackWebhook(req, res, next);
//     }).catch(next);
//   }
// );

// Mount Admin docs before admin routes so auth middleware doesn't block them
try {
  const spec = getSpec(
    adminSpec,
    productSpec,
    cartSpec,
    couponGiftWrapSpec,
    ordersSpec,
    transactionsSpec,
    paystackSpec,
    nichelabSpec,
    contactSpec
  );
  app.use("/api/admin/docs", swaggerUi.serve, swaggerUi.setup(spec));
} catch (err) {
  console.error("Failed to setup Admin docs:", err);
}

// Routes
app.use("/api/auth", adminRoutes);
app.use("/api/admin", cartAdminRoute);
app.use("/api", productRoutes);
app.use("/api/cart", cartRoute);
app.use("/api", orderRoutes);
app.use("/api/auth", admincategoryRoutes);
app.use("/api/auth", adminProductRoutes);
app.use("/api/auth", adminOrderRoutes);
app.use("/api/auth", adminTransactionRoutes);
app.use("/api/auth", adminStats);
app.use("/api", nichelabRoute);
app.use("/api/auth", nichelabAdminRoute);
app.use("/api", contactRoute);
app.use("/api/auth", contactAdminRoute);


// Error Handler
//app.use(errorHandler);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});


// Setup module swagger docs (non-blocking). This will mount docs at `/api/admin/docs`.
// (async () => {
//   try {
//     await setupAdminSwagger(app);
//   } catch (err) {
//     // don't crash the app if swagger setup fails
//     // eslint-disable-next-line no-console
//     console.error("Swagger setup error:", err);
//   }
// })();

export default app;
