import * as orderService from "../services/orders.service.js";

// POST /api/checkout
export const createCheckout = async (req, res, next) => {
  try {
    const result = await orderService.createCheckout(req.body);
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
};

// GET /api/orders/:id
export const getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrder(req.params.id);
    return res.json(order);
  } catch (err) {
    return next(err);
  }
};
