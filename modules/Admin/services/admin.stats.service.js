import Order from "../../orders/models/order.model.js";
import Product from "../../products/models/products.model.js";
import Category from "../../products/models/category.model.js";
import mongoose from "mongoose";

/**
 * Top 3 categories by sales per day
 */
export const getTopCategoriesBySalesService = async () => {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const result = await Order.aggregate([
    {
      $match: {
        paymentStatus: "successful",
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      },
    },

    { $unwind: "$orderItems" },

    // Lookup normal products
    {
      $lookup: {
        from: "products",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "productData",
      },
    },

    // Lookup niche products
    {
      $lookup: {
        from: "nicheproducts",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "nicheData",
      },
    },

    // Merge product
    {
      $addFields: {
        productInfo: {
          $cond: [
            { $gt: [{ $size: "$productData" }, 0] },
            { $arrayElemAt: ["$productData", 0] },
            { $arrayElemAt: ["$nicheData", 0] },
          ],
        },
      },
    },

    { $match: { productInfo: { $ne: null } } },

    // Lookup normal categories
    {
      $lookup: {
        from: "categories",
        localField: "productInfo.category",
        foreignField: "_id",
        as: "categoryData",
      },
    },

    // Lookup niche categories
    {
      $lookup: {
        from: "nichecategories",
        localField: "productInfo.category",
        foreignField: "_id",
        as: "nicheCategoryData",
      },
    },

    // Merge category
    {
      $addFields: {
        categoryInfo: {
          $cond: [
            { $gt: [{ $size: "$categoryData" }, 0] },
            { $arrayElemAt: ["$categoryData", 0] },
            { $arrayElemAt: ["$nicheCategoryData", 0] },
          ],
        },
      },
    },

    { $match: { categoryInfo: { $ne: null } } },

    // Group by category
    {
      $group: {
        _id: "$categoryInfo._id",
        name: { $first: "$categoryInfo.name" },
        totalSales: { $sum: "$orderItems.subtotal" },
      },
    },

    { $sort: { totalSales: -1 } },

    // Calculate monthly grand total
    {
      $group: {
        _id: null,
        categories: {
          $push: {
            categoryId: "$_id",
            name: "$name",
            totalSales: "$totalSales",
          },
        },
        grandTotal: { $sum: "$totalSales" },
      },
    },

    { $unwind: "$categories" },

    {
      $addFields: {
        "categories.percentage": {
          $round: [
            {
              $multiply: [
                { $divide: ["$categories.totalSales", "$grandTotal"] },
                100,
              ],
            },
            2,
          ],
        },
      },
    },

    { $sort: { "categories.totalSales": -1 } },
    { $limit: 3 },
  ]);

  if (!result.length) {
    return { totalSales: 0, topCategories: [] };
  }

  return {
    totalSales: result[0].grandTotal,
    topCategories: result.map((r) => r.categories),
  };
};
// export const getTopCategoriesBySalesService = async () => {
//   const result = await Order.aggregate([
//     {
//       $match: {
//         paymentStatus: "successful",
//       },
//     },

//     { $unwind: "$orderItems" },

//     // Lookup normal products
//     {
//       $lookup: {
//         from: "products",
//         localField: "orderItems.product",
//         foreignField: "_id",
//         as: "productData",
//       },
//     },

//     // Lookup niche products
//     {
//       $lookup: {
//         from: "nicheproducts",
//         localField: "orderItems.product",
//         foreignField: "_id",
//         as: "nicheData",
//       },
//     },

//     // Merge whichever product exists
//     {
//       $addFields: {
//         productInfo: {
//           $cond: [
//             { $gt: [{ $size: "$productData" }, 0] },
//             { $arrayElemAt: ["$productData", 0] },
//             { $arrayElemAt: ["$nicheData", 0] },
//           ],
//         },
//       },
//     },

//     // Remove invalid products
//     {
//       $match: {
//         productInfo: { $ne: null },
//       },
//     },

//     // Lookup normal categories
//     {
//       $lookup: {
//         from: "categories",
//         localField: "productInfo.category",
//         foreignField: "_id",
//         as: "categoryData",
//       },
//     },

//     // Lookup niche categories
//     {
//       $lookup: {
//         from: "nichecategories",
//         localField: "productInfo.category",
//         foreignField: "_id",
//         as: "nicheCategoryData",
//       },
//     },

//     // Merge whichever category exists
//     {
//       $addFields: {
//         categoryInfo: {
//           $cond: [
//             { $gt: [{ $size: "$categoryData" }, 0] },
//             { $arrayElemAt: ["$categoryData", 0] },
//             { $arrayElemAt: ["$nicheCategoryData", 0] },
//           ],
//         },
//       },
//     },

//     {
//       $match: {
//         categoryInfo: { $ne: null },
//       },
//     },

//     // Group by category
//     {
//       $group: {
//         _id: "$categoryInfo._id",
//         name: { $first: "$categoryInfo.name" },
//         totalSales: { $sum: "$orderItems.subtotal" },
//       },
//     },

//     { $sort: { totalSales: -1 } },

//     // Calculate grand total
//     {
//       $group: {
//         _id: null,
//         categories: {
//           $push: {
//             categoryId: "$_id",
//             name: "$name",
//             totalSales: "$totalSales",
//           },
//         },
//         grandTotal: { $sum: "$totalSales" },
//       },
//     },

//     { $unwind: "$categories" },

//     // Add percentage
//     {
//       $addFields: {
//         "categories.percentage": {
//           $round: [
//             {
//               $multiply: [
//                 { $divide: ["$categories.totalSales", "$grandTotal"] },
//                 100,
//               ],
//             },
//             2,
//           ],
//         },
//       },
//     },

//     { $sort: { "categories.totalSales": -1 } },

//     { $limit: 3 },
//   ]);

//   if (!result.length) {
//     return {
//       totalSales: 0,
//       topCategories: [],
//     };
//   }

//   return {
//     totalSales: result[0].grandTotal,
//     topCategories: result.map((r) => r.categories),
//   };
// };

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

    { $sort: { totalQuantitySold: -1 } },

    { $limit: 5 },

    // Lookup normal products
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productData",
      },
    },

    // Lookup niche products
    {
      $lookup: {
        from: "nicheproducts",
        localField: "_id",
        foreignField: "_id",
        as: "nicheData",
      },
    },

    // Merge whichever exists
    {
      $addFields: {
        productInfo: {
          $cond: [
            { $gt: [{ $size: "$productData" }, 0] },
            { $arrayElemAt: ["$productData", 0] },
            { $arrayElemAt: ["$nicheData", 0] },
          ],
        },
      },
    },

    // Remove products that somehow no longer exist
    {
      $match: {
        productInfo: { $ne: null },
      },
    },

    {
      $project: {
        productId: "$productInfo._id",
        name: "$productInfo.name",
        price: "$productInfo.price",
        totalOrders: 1,
        totalQuantitySold: 1,
        inStock: { $gt: ["$productInfo.stock", 0] },
        _id: 0,
      },
    },
  ]);
};
// export const getTopProductsBySalesService = async () => {
//   return Order.aggregate([
//     {
//       $match: {
//         paymentStatus: "successful",
//       },
//     },
//     { $unwind: "$orderItems" },
//     {
//       $group: {
//         _id: "$orderItems.product",
//         totalOrders: { $sum: 1 },
//         totalQuantitySold: { $sum: "$orderItems.quantity" },
//       },
//     },
//     { $sort: { totalOrders: -1 } },
//     { $limit: 5 },
//     {
//       $lookup: {
//         from: "products",
//         localField: "_id",
//         foreignField: "_id",
//         as: "product",
//       },
//     },
//     { $unwind: "$product" },
//     {
//       $project: {
//         productId: "$product._id",
//         name: "$product.name",
//         price: "$product.price",
//         totalOrders: 1,
//         totalQuantitySold: 1,
//         inStock: { $gt: ["$product.stock", 0] },
//       },
//     },
//   ]);
// };

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