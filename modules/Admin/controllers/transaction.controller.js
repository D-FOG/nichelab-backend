import { getAllTransactions, getTransactionById, getTransactionsByStatus, updateTransactionStatus } from "../services/transaction.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const getAllTransactionsController = async (req, res, next) => {
  try {
    const transactions = await getAllTransactions();
    return res.status(200).json(new ApiResponse(200, "Transactions fetched successfully", transactions));
  } catch (err) {
    next(err);
  }
};

export const getTransactionByIdController = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const transaction = await getTransactionById(transactionId);
    return res.status(200).json(new ApiResponse(200, "Transaction fetched successfully", transaction));
  } catch (err) {
    next(err);
  } 
};

export const getTransactionsByStatusController = async (req, res, next) => {
  try {
    const status = req.params.status.toLowerCase();
    const transactions = await getTransactionsByStatus(status);
    return res.status(200).json(new ApiResponse(200, "Transactions fetched successfully", transactions));
  } catch (err) {
    next(err);
  }
};

export const updateTransactionStatusController = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;
    const transaction = await updateTransactionStatus(transactionId, status);
    return res.status(200).json(new ApiResponse(200, "Transaction status updated successfully", transaction));
  } catch (err) {
    next(err);
  }
};