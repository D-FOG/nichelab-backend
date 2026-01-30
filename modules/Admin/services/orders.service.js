import { Order } from '../../orders/models/order.model';
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

    if (!order) throw new Error("Order not found");

    return order;
  } catch (err) {
    throw err;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

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
    if (!order) throw new Error("Order not found");

    order.archived = true;
    await order.save();

    return order;
  } catch (err) {
    throw err;
  }
};
