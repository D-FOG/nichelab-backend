import { Transaction }  from "../../transctions/models/transaction.models";

export const getAllTransactions = async () => {
  try {
    const transactions = await Transaction.find()
      .populate("order", "orderId totalAmount customerName")
      .sort({ createdAt: -1 });
    return transactions;
  } catch (err) {
    throw err;
  }
};

export const getTransactionById = async (transactionId) => {
  try {
    const transaction = await Transaction.findById(transactionId)
      .populate("order", "orderId totalAmount customerName");

    if (!transaction) throw new Error("Transaction not found");

    return transaction;
  } catch (err) {
    throw err;
  }
};

export const getTransactionsByStatus = async (status) => {
  try {
    const transactions = await Transaction.find({ status })
      .populate("order", "orderId totalAmount customerName")
      .sort({ createdAt: -1 });

    return transactions;
  } catch (err) {
    throw err;
  }
};

export const updateTransactionStatus = async (transactionId, status) => {
  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) throw new Error("Transaction not found");

    transaction.status = status;
    await transaction.save();

    return transaction;
  } catch (err) {
    throw err;
  }
};
