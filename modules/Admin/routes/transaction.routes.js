import { Router } from "express";
import { getAllTransactionsController, getTransactionByIdController, getTransactionsByStatusController, updateTransactionStatusController } from "../controllers/transaction.controller.js";
import { superAdminOnly } from "../../../middlewares/superAdminAuth.js";

const router = Router();

router.get("/admin/transactions", superAdminOnly, getAllTransactionsController);
router.get("/admin/transactions/status/:status", superAdminOnly, getTransactionsByStatusController);
router.get("/admin/transactions/:transactionId", superAdminOnly, getTransactionByIdController);
router.patch("/admin/transactions/:transactionId/status", superAdminOnly, updateTransactionStatusController);

export default router;