export const orderSpec = {
  tags: [
    { name: "Orders", description: "Checkout and order retrieval" },
  ],
  paths: {
    "/api/checkout": {
      post: {
        tags: ["Orders"],
        summary: "Create checkout / initialize payment",
        description: "Create an order from a cart or explicit items and initialize payment",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  cartId: { type: "string" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        productId: { type: "string" },
                        bottleSize: { type: "string" },
                        qty: { type: "integer" },
                      },
                    },
                  },
                  customer: { $ref: "#/components/schemas/Customer" },
                  expectedTotal: { type: "number", description: "Optional client-calculated total for server validation" },
                  callbackUrl: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Checkout initialized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    authorization_url: { type: "string" },
                    reference: { type: "string" },
                    orderId: { type: "string" },
                  },
                },
              },
            },
          },
          400: { description: "Invalid request or total mismatch" },
          500: { description: "Payment initialization failed" },
        },
      },
    },
    "/api/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get order by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Order retrieved", content: { "application/json": { schema: { $ref: "#/components/schemas/Order" } } } },
          404: { description: "Order not found" },
        },
      },
    },
  },
  components: {
    schemas: {
      Customer: {
        type: "object",
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          deliveryType: { type: "string", enum: ["ship", "pickup"] },
          saveInfo: { type: "boolean" },
          shippingAddress: {
            type: "object",
            properties: {
              company: { type: "string" },
              address1: { type: "string" },
              address2: { type: "string" },
              city: { type: "string" },
              state: { type: "string" },
              postalCode: { type: "string" },
              country: { type: "string" },
            },
          },
          billingAddress: {
            type: "object",
            properties: {
              company: { type: "string" },
              address1: { type: "string" },
              address2: { type: "string" },
              city: { type: "string" },
              state: { type: "string" },
              postalCode: { type: "string" },
              country: { type: "string" },
            },
          },
        },
      },
      OrderItem: {
        type: "object",
        properties: {
          product: { type: "string" },
          name: { type: "string" },
          bottleSize: { type: "string" },
          quantity: { type: "integer" },
          unitPrice: { type: "number" },
          subtotal: { type: "number" },
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
      Order: {
        type: "object",
        properties: {
          _id: { type: "string" },
          orderId: { type: "string" },
          status: { type: "string" },
          orderItems: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
          pricing: { $ref: "#/components/schemas/Pricing" },
          paymentStatus: { type: "string" },
          customer: { $ref: "#/components/schemas/Customer" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};

export default orderSpec;
