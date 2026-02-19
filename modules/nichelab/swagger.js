export const nichelabSpec = {
  tags: [
    { name: "Nichelab - Public", description: "Public niche product endpoints" },
    { name: "Nichelab - Admin", description: "Admin niche product and category endpoints" },
  ],
  paths: {
    "/api/niche/categories": {
      get: {
        tags: ["Nichelab - Public"],
        summary: "Get all niche categories",
        responses: { "200": { description: "Categories fetched" } },
      },
    },
    "/api/niche/products": {
      get: {
        tags: ["Nichelab - Public"],
        summary: "Get all niche products",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          "200": {
            description: "Products list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { $ref: "#/components/schemas/NicheProduct" } },
                    pagination: {
                      type: "object",
                      properties: {
                        total: { type: "integer" },
                        page: { type: "integer" },
                        limit: { type: "integer" },
                        pages: { type: "integer" },
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
    "/api/niche/products/{id}": {
      get: {
        tags: ["Nichelab - Public"],
        summary: "Get niche product by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Product fetched" }, "404": { description: "Not found" } },
      },
    },
    "/api/niche/products/category/{categoryId}": {
      get: {
        tags: ["Nichelab - Public"],
        summary: "Get niche products by category",
        parameters: [{ name: "categoryId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Products list" }, "404": { description: "Category not found" } },
      },
    },

    // Admin endpoints (mounted under /api/auth)
    "/api/auth/admin/niche/categories": {
      post: {
        tags: ["Nichelab - Admin"],
        summary: "Create a niche category (admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["name"], properties: { name: { type: "string" }, description: { type: "string" } } },
            },
          },
        },
        responses: { "201": { description: "Category created" } },
      },
      get: {
        tags: ["Nichelab - Admin"],
        summary: "Get all niche categories (admin)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Categories list" } },
      },
    },
    "/api/auth/admin/niche/categories/{id}": {
      delete: {
        tags: ["Nichelab - Admin"],
        summary: "Delete a niche category (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Category deleted" }, "404": { description: "Not found" } },
      },
      put: {
        tags: ["Nichelab - Admin"],
        summary: "Update a niche category (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: false,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  image: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Category updated" }, "404": { description: "Not found" } },
      },
    },

    "/api/auth/admin/niche/products": {
      post: {
        tags: ["Nichelab - Admin"],
        summary: "Create a niche product (admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["name", "price", "bottleSize", "category", "stock"],
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  bottleSize: { type: "string", enum: ["30ml", "50ml", "75ml", "100ml"] },
                  category: { type: "string" },
                  stock: { type: "integer" },
                  images: { type: "array", items: { type: "string", format: "binary" } },
                  tags: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Product created" } },
      },
      get: {
        tags: ["Nichelab - Admin"],
        summary: "Get all niche products (admin)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Products list" } },
      },
    },
    "/api/auth/admin/niche/products/{id}": {
      get: {
        tags: ["Nichelab - Admin"],
        summary: "Get niche product by id (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Product fetched" }, "404": { description: "Not found" } },
      },
      put: {
        tags: ["Nichelab - Admin"],
        summary: "Update niche product (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: false,
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
                  stock: { type: "integer" },
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
        tags: ["Nichelab - Admin"],
        summary: "Delete niche product (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Product deleted" }, "404": { description: "Not found" } },
      },
    },
  },
  components: {
    schemas: {
      NicheCategory: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          image: { type: "string" },
        },
      },
      NicheProduct: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          bottleSize: { type: "string" },
          category: { $ref: "#/components/schemas/NicheCategory" },
          stock: { type: "integer" },
          tags: { type: "array", items: { type: "string" } },
          images: { type: "array", items: { type: "object", properties: { publicId: { type: "string" }, url: { type: "string" } } } },
        },
      },
    },
  },
};

export default nichelabSpec;
