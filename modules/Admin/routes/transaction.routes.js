import { Router } from "express";
import { getAllTransactionsController, getTransactionByIdController, getTransactionsByStatusController, updateTransactionStatusController } from "../controllers/transaction.controller";

const router = Router();

router.get("/admin/transactions", getAllTransactionsController);
router.get("/admin/transactions/status/:status", getTransactionsByStatusController);
router.get("/admin/transactions/:transactionId", getTransactionByIdController);
router.patch("/admin/transactions/:transactionId/status", updateTransactionStatusController);

export default router;