import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimiter from "./middlewares/rateLimit.js";
import adminRoutes from "./modules/Admin/routes/admin.route.js";
import errorHandler from "./middlewares/error.js";

const app = express();

// Global Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use("/api/admin", adminRoutes);

// Error Handler
app.use(errorHandler);

export default app;
