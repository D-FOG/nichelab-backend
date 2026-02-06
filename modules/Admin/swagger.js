// Single Admin OpenAPI fragment — intended to be merged with the base spec
export default {
  tags: [
    { name: "Admin", description: "Admin module endpoints" },
  ],
  paths: {
    "/api/admin/admin/signup": {
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
    "/api/admin/admin/login": {
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
    "/api/admin/admins/me": {
      get: {
        tags: ["Admin"],
        summary: "Get current admin profile",
        responses: { "200": { description: "Profile fetched" }, "401": { description: "Unauthorized" } },
      },
    },
    "/api/admin/admins": {
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
    "/api/admin/admins/active": {
      get: {
        tags: ["Admin"],
        summary: "Fetch active admins",
        responses: { "200": { description: "Active admins" } },
      },
    },
    "/api/admin/admins/stats": {
      get: {
        tags: ["Admin"],
        summary: "Get admin statistics",
        responses: { "200": { description: "Stats fetched" } },
      },
    },
    "/api/admin/admins/{id}": {
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
    "/api/admin/admins/change-password": {
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
    "/api/admin/admin/reset-password": {
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
    "/api/admin/admin/reset-password/confirm": {
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
    },
  },
};
