// Admin Transactions OpenAPI fragment
export default {
  tags: [
    { name: "Transactions", description: "Payment transactions (admin)" },
  ],
  paths: {
    "/api/admin/transactions": {
      get: {
        tags: ["Transactions"],
        summary: "Get all transactions (superadmin)",
        responses: { "200": { description: "Transactions list" }, "403": { description: "Forbidden" } },
      },
    },
    "/api/admin/transactions/status/{status}": {
      get: {
        tags: ["Transactions"],
        summary: "Get transactions by status (superadmin)",
        parameters: [
          { name: "status", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Transactions list" }, "403": { description: "Forbidden" } },
      },
    },
    "/api/admin/transactions/{transactionId}": {
      get: {
        tags: ["Transactions"],
        summary: "Fetch a single transaction by id (superadmin)",
        parameters: [
          { name: "transactionId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Transaction" }, "404": { description: "Not found" } },
      },
    },
    "/api/admin/transactions/{transactionId}/status": {
      patch: {
        tags: ["Transactions"],
        summary: "Update transaction status (superadmin)",
        parameters: [
          { name: "transactionId", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { status: { type: "string", example: "success" } },
                required: ["status"],
              },
            },
          },
        },
        responses: { "200": { description: "Transaction updated" }, "404": { description: "Not found" } },
      },
    },
  },
  components: {
    schemas: {
      Transaction: {
        type: "object",
        properties: {
          _id: { type: "string" },
          orderId: { type: "string" },
          reference: { type: "string" },
          amount: { type: "number" },
          currency: { type: "string" },
          status: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          rawResponse: { type: "object" },
        },
      },
    },
  },
};
