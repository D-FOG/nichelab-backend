export const contactSpec = {
  tags: [
    { name: "Contact", description: "Public contact endpoints" },
    { name: "Contact - Admin", description: "Admin contact message endpoints" },
  ],
  paths: {
    "/api/contact": {
      post: {
        tags: ["Contact"],
        summary: "Send contact message",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "phone", "subject", "message"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  phone: { type: "string" },
                  subject: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Message sent" }, "400": { description: "Bad request" } },
      },
    },

    "/api/auth/admin/contact/messages": {
      get: {
        tags: ["Contact - Admin"],
        summary: "Get all contact messages (admin)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Messages list" } },
      },
    },

    "/api/auth/admin/contact/messages/{id}": {
      get: {
        tags: ["Contact - Admin"],
        summary: "Get a specific contact message (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Message fetched" }, "404": { description: "Not found" } },
      },
      delete: {
        tags: ["Contact - Admin"],
        summary: "Delete a contact message (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Message deleted" }, "404": { description: "Not found" } },
      },
    },
  },
  components: {
    schemas: {
      ContactMessage: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          subject: { type: "string" },
          message: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};

export default contactSpec;
