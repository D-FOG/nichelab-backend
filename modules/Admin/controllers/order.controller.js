import { getAllOrders, getOrderById, updateOrderStatus, deleteOrder, getAdminDashboardStatsService } from "../services/orders.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const getAllOrdersController = async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    return res.status(200).json(new ApiResponse(200, "Orders fetched successfully", orders));
    } catch (err) {
        next(err);
    }
};

export const getOrderByIdController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await getOrderById(orderId);
    return res.status(200).json(new ApiResponse(200, "Order fetched successfully", order));
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatusController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await updateOrderStatus(orderId, status);
    return res.status(200).json(new ApiResponse(200, "Order status updated successfully", order));
  } catch (err) {
    next(err);
  }
};
export const deleteOrderController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await deleteOrder(orderId);
    return res.status(200).json(new ApiResponse(200, "Order deleted successfully", order));
    } catch (err) {
        next(err);
    }
};

export const getAdminDashboardStatsController = async (req, res, next) => {
  try {
    const stats = await getAdminDashboardStatsService();
    return res.status(200).json(new ApiResponse(200, "Admin dashboard stats fetched successfully", stats));
  } catch (err) {
    next(err);
  }
};