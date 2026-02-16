import Transaction from "../../transctions/models/transaction.models.js";
import { ApiError } from "../../../utils/ApiError.js";

const ORDER_POPULATE = {
  path: "orderId",
  select: "orderId pricing.total customer.firstName customer.lastName paymentStatus status",
};

export const getAllTransactions = async () => {
  const transactions = await Transaction.find()
    .populate(ORDER_POPULATE)
    .sort({ createdAt: -1 })
    .lean();

  return transactions;
};

export const getTransactionById = async (transactionId) => {
  const transaction = await Transaction.findById(transactionId)
    .populate(ORDER_POPULATE)
    .lean();

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return transaction;
};

export const getTransactionsByStatus = async (status) => {
  const allowedStatuses = ["pending", "success", "failed"];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid transaction status");
  }

  const transactions = await Transaction.find({ status })
    .populate(ORDER_POPULATE)
    .sort({ createdAt: -1 })
    .lean();

  return transactions;
};

export const updateTransactionStatus = async (transactionId, status) => {
  const allowedStatuses = ["pending", "success", "failed"];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid transaction status");
  }

  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  transaction.status = status;
  await transaction.save();

  return transaction;
};