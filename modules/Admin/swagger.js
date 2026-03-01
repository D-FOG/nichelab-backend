// Single Admin OpenAPI fragment — intended to be merged with the base spec
export default {
  tags: [
    { name: "Admin", description: "Admin module endpoints" },
  ],
  paths: {
    "/api/auth/admin/signup": {
      post: {
        tags: ["Admin"],
        summary: "Create an admin (self-signup)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
                required: ["firstName", "lastName", "email", "password"],
              },
            },
          },
        },
        responses: { "201": { description: "Admin created" } },
      },
    },
    "/api/auth/admin/login": {
      post: {
        tags: ["Admin"],
        summary: "Admin login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: { "200": { description: "Login successful" }, "401": { description: "Unauthorized" } },
      },
    },
    "/api/auth/admins/me": {
      get: {
        tags: ["Admin"],
        summary: "Get current admin profile",
        responses: { "200": { description: "Profile fetched" }, "401": { description: "Unauthorized" } },
      },
    },
    "/api/auth/admins": {
      post: {
        tags: ["Admin"],
        summary: "Create admin (superadmin)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
                required: ["firstName", "lastName", "email", "password"],
              },
            },
          },
        },
        responses: { "201": { description: "Admin created" }, "403": { description: "Forbidden" } },
      },
      get: {
        tags: ["Admin"],
        summary: "Fetch all admins (superadmin)",
        responses: { "200": { description: "Admins fetched" }, "403": { description: "Forbidden" } },
      },
    },
    "/api/auth/admins/active": {
      get: {
        tags: ["Admin"],
        summary: "Fetch active admins",
        responses: { "200": { description: "Active admins" } },
      },
    },
    "/api/auth/admins/stats": {
      get: {
        tags: ["Admin"],
        summary: "Get admin statistics",
        responses: { "200": { description: "Stats fetched" } },
      },
    },
    "/api/auth/admins/{id}": {
      patch: {
        tags: ["Admin"],
        summary: "Update admin details (superadmin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } },
        },
        responses: { "200": { description: "Admin updated" }, "404": { description: "Not found" } },
      },
      delete: {
        tags: ["Admin"],
        summary: "Disable admin (soft delete)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Admin disabled" }, "404": { description: "Not found" } },
      },
    },
    "/api/auth/admins/change-password": {
      post: {
        tags: ["Admin"],
        summary: "Change current admin password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string" },
                },
                required: ["currentPassword", "newPassword"],
              },
            },
          },
        },
        responses: { "200": { description: "Password changed" }, "400": { description: "Bad request" } },
      },
    },
    "/api/auth/admin/reset-password": {
      post: {
        tags: ["Admin"],
        summary: "Request a password reset link",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                },
                required: ["email"],
              },
            },
          },
        },
        responses: { "200": { description: "If that email exists, a reset link was sent" } },
      },
    },
    "/api/auth/admin/reset-password/confirm": {
      post: {
        tags: ["Admin"],
        summary: "Confirm password reset with token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string" },
                  newPassword: { type: "string" },
                },
                required: ["token", "newPassword"],
              },
            },
          },
        },
        responses: { "200": { description: "Password updated successfully" }, "400": { description: "Invalid or expired token" } },
      },
    },
    "/api/auth/admin/products": {
      post: {
        tags: ["Admin"],
        summary: "Create a new product (superadmin)",
        description: "Create a product with images (multipart form data)",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  bottleSize: { type: "string", enum: ["30ml", "50ml", "75ml", "100ml"] },
                  category: { type: "string" },
                  stock: { type: "number" },
                  images: { type: "array", items: { type: "string", format: "binary" } },
                  tags: { type: "array", items: { type: "string" } },
                },
                required: ["name", "price", "bottleSize", "category", "stock"],
              },
            },
          },
        },
        responses: { "201": { description: "Product created" }, "400": { description: "Bad request" } },
      },
      get: {
        tags: ["Admin"],
        summary: "Get all products (superadmin)",
        responses: { "200": { description: "Products list" } },
      },
    },
    "/api/auth/admin/products/{productId}": {
      get: {
        tags: ["Admin"],
        summary: "Get product by id (superadmin)",
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Product" }, "404": { description: "Not found" } },
      },
      put: {
        tags: ["Admin"],
        summary: "Update product (superadmin)",
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  bottleSize: { type: "string", enum: ["30ml", "50ml", "75ml", "100ml"] },
                  category: { type: "string" },
                  stock: { type: "number" },
                  images: { type: "array", items: { type: "string", format: "binary" } },
                  tags: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Product updated" }, "404": { description: "Not found" } },
      },
      delete: {
        tags: ["Admin"],
        summary: "Delete product (superadmin)",
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Product deleted" }, "404": { description: "Not found" } },
      },
    },
    "/api/auth/admin/categories/{categoryId}/products": {
      get: {
        tags: ["Admin"],
        summary: "Get products by category (superadmin)",
        parameters: [{ name: "categoryId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Products list" }, "404": { description: "Category not found" } },
      },
    },
    "/api/auth/admin/categories": {
      post: {
        tags: ["Admin"],
        summary: "Create a new category (superadmin)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                },
                required: ["name"],
              },
            },
          },
        },
        responses: { "201": { description: "Category created" }, "400": { description: "Bad request" } },
      },
      get: {
        tags: ["Admin"],
        summary: "Get all categories (superadmin)",
        responses: { "200": { description: "Categories list" } },
      },
    },
    "/api/auth/admin/categories/{categoryId}": {
      get: {
        tags: ["Admin"],
        summary: "Get category by id (superadmin)",
        parameters: [{ name: "categoryId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Category" }, "404": { description: "Not found" } },
      },
      put: {
        tags: ["Admin"],
        summary: "Update category (superadmin)",
        parameters: [{ name: "categoryId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Category updated" }, "404": { description: "Not found" } },
      },
      delete: {
        tags: ["Admin"],
        summary: "Delete category (superadmin)",
        parameters: [{ name: "categoryId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Category deleted" }, "404": { description: "Not found" } },
      },
    },
    "/api/auth/admin/orders": {
      get: {
        tags: ["Admin"],
        summary: "Get all orders (superadmin)",
        responses: { "200": { description: "Orders list" } },
      },
    },
    "/api/auth/admin/orders/{orderId}": {
      get: {
        tags: ["Admin"],
        summary: "Get order by id (superadmin)",
        parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Order details" }, "404": { description: "Not found" } },
      },
      delete: {
        tags: ["Admin"],
        summary: "Delete order (superadmin)",
        parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Order deleted" }, "404": { description: "Not found" } },
      },
    },
    "/api/auth/admin/orders/{orderId}/status": {
      patch: {
        tags: ["Admin"],
        summary: "Update order status (superadmin)",
        parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["created", "pending", "processing", "shipped", "delivered", "cancelled"],
                  },
                },
                required: ["status"],
              },
            },
          },
        },
        responses: { "200": { description: "Order status updated" }, "404": { description: "Not found" } },
      },
    },
    "/api/auth/admin/dashboard/stats": {
      get: {
        tags: ["Admin"],
        summary: "Get admin dashboard statistics (superadmin)",
        description: "Fetches dashboard stats including total orders, revenue, transactions, etc.",
        responses: { "200": { description: "Dashboard statistics" } },
      },
    },
    "/api/auth/admin/stats/categories/top": {
      get: {
        tags: ["Admin Stats"],
        summary: "Get top 3 categories by sales per day (superadmin)",
        description:
          "Returns the top 3 categories per day based on successful order sales amount.",
        responses: {
          "200": {
            description: "Top categories by daily sales",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          date: { type: "string", example: "2024-01-15" },
                          categories: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                categoryId: { type: "string" },
                                name: { type: "string" },
                                totalSales: { type: "number" },
                                totalOrders: { type: "number" },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },

    "/api/auth/admin/stats/products/top": {
      get: {
        tags: ["Admin Stats"],
        summary: "Get top 5 products by sales/orders (superadmin)",
        description:
          "Returns the top 5 products ranked by number of successful orders.",
        responses: {
          "200": {
            description: "Top selling products",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          productId: { type: "string" },
                          name: { type: "string" },
                          price: { type: "number" },
                          totalOrders: { type: "number" },
                          totalQuantitySold: { type: "number" },
                          inStock: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },

    "/api/auth/admin/stats/overview": {
      get: {
        tags: ["Admin Stats"],
        summary: "Get total orders and total revenue (superadmin)",
        description:
          "Returns overall statistics including total successful orders and total revenue.",
        responses: {
          "200": {
            description: "Overall admin statistics",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        totalOrders: { type: "number" },
                        totalRevenue: { type: "number" },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/auth/admin/products/{productId}/restore": {
      patch: {
        tags: ["Admin"],
        summary: "Restore archived product (superadmin)",
        description: "Restores a soft-deleted product by setting archived to false and isActive to true.",
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Product restored successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
          "400": { description: "Product is not archived" },
          "404": { description: "Product not found" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
  },
  components: {
    schemas: {
      Admin: {
        type: "object",
        properties: {
          _id: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string" },
        },
      },
      Product: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          category: { type: "string" },
          stock: { type: "number" },
          images: { type: "array", items: { type: "string" } },
          tags: { type: "array", items: { type: "string" } },
          ratings: { type: "array" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Category: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Order: {
        type: "object",
        properties: {
          _id: { type: "string" },
          orderId: { type: "string" },
          status: { type: "string" },
          orderItems: { type: "array" },
          pricing: { type: "object" },
          customer: { type: "object" },
          paymentStatus: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};
