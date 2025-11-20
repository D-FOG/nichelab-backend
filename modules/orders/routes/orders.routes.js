import express from "express";
import { createCheckout, getOrder } from "../controllers/orders.controller.js";

const router = express.Router();

router.post("/checkout", createCheckout);
router.get("/orders/:id", getOrder);

export default router;
