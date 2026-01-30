import { Router } from "express";
import { getAllOrdersController, getOrderByIdController, updateOrderStatusController, deleteOrderController } from "../controllers/order.controller";

const router = Router();

router.get("/admin/orders", getAllOrdersController);
router.get("/admin/orders/:orderId", getOrderByIdController);
router.patch("/admin/orders/:orderId/status", updateOrderStatusController);
router.delete("/admin/orders/:orderId", deleteOrderController);

export default router;