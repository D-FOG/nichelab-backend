import Order from '../../orders/models/order.model.js';
import { ApiError } from '../../../utils/ApiError.js';
export const getAllOrders = async () => {
  try {
    const orders = await Order.find()
      .populate("orderItems.product", "name price bottleSize")
      .sort({ createdAt: -1 });

    return orders;
  } catch (err) {
    throw err;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate("orderItems.product", "name price bottleSize");

    if (!order) throw new ApiError(404, "Order not found");

    return order;
  } catch (err) {
    throw err;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");

    if (status) order.status = status;

    await order.save();

    return order;
  } catch (err) {
    throw err;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");

    order.archived = true;
    await order.save();

    return order;
  } catch (err) {
    throw err;
  }
};

export const getAdminDashboardStatsService = async () => {
  const totalOrders = await Order.countDocuments();

  const totalTransactions = await Transaction.countDocuments({
    status: "success",
  });

  const revenueAgg = await Transaction.aggregate([
    { $match: { status: "success" } },
    { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
  ]);

  const profitAgg = await Order.aggregate([
    { $match: { paymentStatus: "successful" } },
    { $group: { _id: null, totalProfit: { $sum: "$profit" } } },
  ]);

  return {
    totalOrders,
    totalTransactions,
    totalRevenue: revenueAgg[0]?.totalRevenue || 0,
    totalProfit: profitAgg[0]?.totalProfit || 0,
  };
};

