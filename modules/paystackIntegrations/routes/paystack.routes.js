import express from "express";
import { paystackWebhook } from "../controllers/paystack.controller.js";

const router = express.Router();

// Important: DO NOT attach normal json parser for this route in app.js
// We'll mount this route in app.js using express.raw middleware.

router.post("/paystack/webhook", paystackWebhook);

export default router;
