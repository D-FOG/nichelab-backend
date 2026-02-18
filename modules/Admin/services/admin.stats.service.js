import Order from "../../orders/models/order.model.js";
import Product from "../../products/models/products.model.js";
import Category from "../../products/models/category.model.js";
import mongoose from "mongoose";

/**
 * Top 3 categories by sales per day
 */
export const getTopCategoriesBySalesPerDayService = async () => {
  return Order.aggregate([
    {
      $match: {
        paymentStatus: "successful",
      },
    },
    {
      $unwind: "$orderItems",
    },
    {
      $lookup: {
        from: "products",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "categories",
        localField: "product.category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $group: {
        _id: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          categoryId: "$category._id",
          categoryName: "$category.name",
        },
        totalSales: { $sum: "$orderItems.subtotal" },
        totalOrders: { $sum: 1 },
      },
    },
    {
      $sort: { totalSales: -1 },
    },
    {
      $group: {
        _id: "$_id.date",
        categories: {
          $push: {
            categoryId: "$_id.categoryId",
            name: "$_id.categoryName",
            totalSales: "$totalSales",
            totalOrders: "$totalOrders",
          },
        },
      },
    },
    {
      $project: {
        date: "$_id",
        categories: { $slice: ["$categories", 3] },
        _id: 0,
      },
    },
    { $sort: { date: -1 } },
  ]);
};

/**
 * Top 5 products by sales/orders
 */
export const getTopProductsBySalesService = async () => {
  return Order.aggregate([
    {
      $match: {
        paymentStatus: "successful",
      },
    },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        totalOrders: { $sum: 1 },
        totalQuantitySold: { $sum: "$orderItems.quantity" },
      },
    },
    { $sort: { totalOrders: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        productId: "$product._id",
        name: "$product.name",
        price: "$product.price",
        totalOrders: 1,
        totalQuantitySold: 1,
        inStock: { $gt: ["$product.stock", 0] },
      },
    },
  ]);
};

/**
 * Total orders & revenue (successful)
 */
export const getAdminTotalsService = async () => {
  const stats = await Order.aggregate([
    {
      $match: {
        paymentStatus: "successful",
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$pricing.total" },
      },
    },
  ]);

  return (
    stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
    }
  );
};