export const cartSpec = {
  tags: [
    {
      name: "Cart",
      description: "Shopping cart operations",
    },
  ],
  paths: {
    "/api/cart/{cartId}": {
      get: {
        tags: ["Cart"],
        summary: "Get or create cart",
        parameters: [
          {
            name: "cartId",
            in: "path",
            required: true,
            description: "Unique cart identifier (usually user ID or session ID)",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Cart retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Cart" },
              },
            },
          },
        },
      },
    },
    "/api/cart/{cartId}/add": {
      post: {
        tags: ["Cart"],
        summary: "Add item to cart",
        parameters: [
          {
            name: "cartId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "quantity", "bottleSize"],
                properties: {
                  productId: { type: "string" },
                  quantity: { type: "integer", minimum: 1 },
                  bottleSize: {
                    type: "string",
                    enum: ["30ml", "50ml", "75ml", "100ml"],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Item added successfully",
          },
          400: {
            description: "Invalid input or out of stock",
          },
        },
      },
    },
    "/api/cart/{cartId}/item/{itemId}": {
      patch: {
        tags: ["Cart"],
        summary: "Update item quantity",
        parameters: [
          {
            name: "cartId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "itemId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["quantity"],
                properties: {
                  quantity: { type: "integer", minimum: 1 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Quantity updated",
          },
        },
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove item from cart",
        parameters: [
          {
            name: "cartId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "itemId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Item removed",
          },
        },
      },
    },
    "/api/cart/{cartId}/clear": {
      delete: {
        tags: ["Cart"],
        summary: "Clear entire cart",
        parameters: [
          {
            name: "cartId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Cart cleared",
          },
        },
      },
    },
    "/api/cart/{cartId}/coupon/apply": {
      post: {
        tags: ["Cart"],
        summary: "Apply coupon to cart",
        parameters: [
          {
            name: "cartId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["couponCode"],
                properties: {
                  couponCode: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Coupon applied successfully",
          },
          400: {
            description: "Invalid coupon or validation failed",
          },
        },
      },
    },
    "/api/cart/{cartId}/coupon": {
      delete: {
        tags: ["Cart"],
        summary: "Remove coupon from cart",
        parameters: [
          {
            name: "cartId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Coupon removed",
          },
        },
      },
    },
    "/api/cart/{cartId}/gift-wrap/apply": {
      post: {
        tags: ["Cart"],
        summary: "Apply gift wrap to cart",
        parameters: [
          {
            name: "cartId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["giftWrapId"],
                properties: {
                  giftWrapId: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Gift wrap applied",
          },
        },
      },
    },
    "/api/cart/{cartId}/gift-wrap": {
      delete: {
        tags: ["Cart"],
        summary: "Remove gift wrap from cart",
        parameters: [
          {
            name: "cartId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Gift wrap removed",
          },
        },
      },
    },
    "/api/cart/{cartId}/gift-wraps": {
      get: {
        tags: ["Cart"],
        summary: "Get available gift wraps",
        parameters: [
          {
            name: "cartId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "List of available gift wraps",
          },
        },
      },
    },
    "/api/cart/{cartId}/validate": {
      post: {
        tags: ["Cart"],
        summary: "Validate cart total",
        description: "Verify cart total to prevent frontend price manipulation",
        parameters: [
          {
            name: "cartId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["total"],
                properties: {
                  total: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Cart total is valid",
          },
          400: {
            description: "Cart total mismatch",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      CartItem: {
        type: "object",
        properties: {
          _id: { type: "string" },
          productId: { type: "string" },
          quantity: { type: "integer" },
          bottleSize: { type: "string" },
          price: { type: "number" },
          productName: { type: "string" },
          productImage: { type: "string" },
        },
      },
      Pricing: {
        type: "object",
        properties: {
          subtotal: { type: "number" },
          couponDiscount: { type: "number" },
          giftWrapFee: { type: "number" },
          total: { type: "number" },
        },
      },
      Cart: {
        type: "object",
        properties: {
          _id: { type: "string" },
          cartId: { type: "string" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/CartItem" },
          },
          subtotal: { type: "number" },
          coupon: {
            type: "object",
            properties: {
              code: { type: "string" },
              discountAmount: { type: "number" },
            },
          },
          giftWrap: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              price: { type: "number" },
            },
          },
          pricing: { $ref: "#/components/schemas/Pricing" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};

export const couponGiftWrapSpec = {
  tags: [
    {
      name: "Admin - Coupons",
      description: "Admin coupon management endpoints",
    },
    {
      name: "Admin - Gift Wraps",
      description: "Admin gift wrap management endpoints",
    },
  ],
  paths: {
    "/api/admin/coupons": {
      post: {
        tags: ["Admin - Coupons"],
        summary: "Create coupon",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["code", "discountType", "discountValue"],
                properties: {
                  code: { type: "string" },
                  description: { type: "string" },
                  discountType: { type: "string", enum: ["percentage", "fixed"] },
                  discountValue: { type: "number", minimum: 0 },
                  maxUses: { type: "integer" },
                  minPurchaseAmount: { type: "number", default: 0 },
                  expiryDate: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Coupon created" },
          400: { description: "Code already exists" },
        },
      },
      get: {
        tags: ["Admin - Coupons"],
        summary: "Get all coupons",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "isActive",
            in: "query",
            schema: { type: "boolean" },
          },
        ],
        responses: {
          200: { description: "List of coupons" },
        },
      },
    },
    "/api/admin/coupons/{id}": {
      get: {
        tags: ["Admin - Coupons"],
        summary: "Get coupon",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Coupon details" },
          404: { description: "Coupon not found" },
        },
      },
      put: {
        tags: ["Admin - Coupons"],
        summary: "Update coupon",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  description: { type: "string" },
                  discountType: { type: "string" },
                  discountValue: { type: "number" },
                  maxUses: { type: "integer" },
                  minPurchaseAmount: { type: "number" },
                  isActive: { type: "boolean" },
                  expiryDate: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Coupon updated" },
        },
      },
      delete: {
        tags: ["Admin - Coupons"],
        summary: "Delete coupon",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Coupon deleted" },
        },
      },
    },
    "/api/admin/coupons/{id}/reset-usage": {
      patch: {
        tags: ["Admin - Coupons"],
        summary: "Reset coupon usage counter",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Coupon usage reset" },
        },
      },
    },
    "/api/admin/gift-wraps": {
      post: {
        tags: ["Admin - Gift Wraps"],
        summary: "Create gift wrap",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "price"],
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number", minimum: 0 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Gift wrap created" },
        },
      },
      get: {
        tags: ["Admin - Gift Wraps"],
        summary: "Get all gift wraps",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "isActive",
            in: "query",
            schema: { type: "boolean" },
          },
        ],
        responses: {
          200: { description: "List of gift wraps" },
        },
      },
    },
    "/api/admin/gift-wraps/{id}": {
      get: {
        tags: ["Admin - Gift Wraps"],
        summary: "Get gift wrap",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Gift wrap details" },
          404: { description: "Gift wrap not found" },
        },
      },
      put: {
        tags: ["Admin - Gift Wraps"],
        summary: "Update gift wrap",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  isActive: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Gift wrap updated" },
        },
      },
      delete: {
        tags: ["Admin - Gift Wraps"],
        summary: "Delete gift wrap",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Gift wrap deleted" },
        },
      },
    },
  },
};

export default cartSpec;
