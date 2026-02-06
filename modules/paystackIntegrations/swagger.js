// Paystack / Payments OpenAPI fragment
export default {
  tags: [
    { name: "Payments", description: "Payment gateway and webhook endpoints" },
  ],
  paths: {
    "/api/payments/paystack/webhook": {
      post: {
        tags: ["Payments"],
        summary: "Paystack webhook receiver (raw body; x-paystack-signature header)",
        description: "Endpoint to receive Paystack transaction events. Mount this route with `express.raw()` so signature verification works.",
        parameters: [
          {
            name: "x-paystack-signature",
            in: "header",
            description: "HMAC SHA512 signature sent by Paystack",
            required: false,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          description: "Raw Paystack event payload (application/json)",
          content: {
            "application/json": {
              schema: { type: "object" },
            },
            "*/*": {
              schema: { type: "object" },
            },
          },
        },
        responses: {
          "200": { description: "ok" },
          "400": { description: "Bad Request / verification failed" },
          "401": { description: "Unauthorized" },
        },
      },
    },
  },
};
