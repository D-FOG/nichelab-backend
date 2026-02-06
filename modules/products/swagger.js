export const productSpec = {
  tags: [
    {
      name: "Products",
      description: "Product management and retrieval endpoints",
    },
  ],
  paths: {
    "/products": {
      get: {
        tags: ["Products"],
        summary: "Get all products with pagination",
        description: "Retrieve all active products with pagination and filters",
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Page number (default: 1)",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Number of products per page (default: 10)",
            schema: { type: "integer", default: 10 },
          },
          {
            name: "category",
            in: "query",
            description: "Filter by category ID",
            schema: { type: "string" },
          },
          {
            name: "tag",
            in: "query",
            description: "Filter by tag (unisex, masculine, feminine)",
            schema: { type: "string" },
          },
          {
            name: "size",
            in: "query",
            description: "Filter by bottle size",
            schema: {
              type: "string",
              enum: ["30ml", "50ml", "75ml", "100ml"],
            },
          },
          {
            name: "search",
            in: "query",
            description: "Search by product name",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Products retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
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
    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get a specific product",
        description: "Retrieve a single product by its ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Product ID",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Product retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          404: {
            description: "Product not found",
          },
        },
      },
    },
    "/products/search": {
      get: {
        tags: ["Products"],
        summary: "Search products",
        description: "Search for products by name with pagination",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            description: "Search query",
            schema: { type: "string" },
          },
          {
            name: "page",
            in: "query",
            description: "Page number (default: 1)",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Number of results per page (default: 10)",
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          200: {
            description: "Search results retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
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
          400: {
            description: "Search query is required",
          },
        },
      },
    },
    "/products/{id}/like": {
      post: {
        tags: ["Products"],
        summary: "Like a product",
        description: "Add a product to user's likes",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Product ID",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Product liked successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    liked: { type: "boolean" },
                    likesCount: { type: "integer" },
                  },
                },
              },
            },
          },
          400: {
            description: "Product already liked",
          },
          401: {
            description: "User authentication required",
          },
        },
      },
    },
    "/products/{id}/unlike": {
      post: {
        tags: ["Products"],
        summary: "Unlike a product",
        description: "Remove a product from user's likes",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Product ID",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Product unliked successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    liked: { type: "boolean" },
                    likesCount: { type: "integer" },
                  },
                },
              },
            },
          },
          400: {
            description: "Product not liked yet",
          },
          401: {
            description: "User authentication required",
          },
        },
      },
    },
    "/products/{id}/is-liked": {
      get: {
        tags: ["Products"],
        summary: "Check if product is liked",
        description: "Check if current user has liked a product",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Product ID",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Like status retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    liked: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/products/{id}/rate": {
      post: {
        tags: ["Products"],
        summary: "Rate a product",
        description: "Add or update rating for a product (1-5 stars)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Product ID",
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rating"],
                properties: {
                  rating: {
                    type: "integer",
                    minimum: 1,
                    maximum: 5,
                    description: "Rating from 1 to 5 stars",
                  },
                  comment: {
                    type: "string",
                    description: "Optional comment",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Rating added successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    averageRating: { type: "number" },
                    totalRatings: { type: "integer" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid rating or missing required fields",
          },
          401: {
            description: "User authentication required",
          },
        },
      },
    },
    "/products/{id}/ratings": {
      get: {
        tags: ["Products"],
        summary: "Get product ratings",
        description: "Retrieve all ratings and average rating for a product",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Product ID",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Ratings retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    averageRating: { type: "number" },
                    totalRatings: { type: "integer" },
                    ratings: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          userId: { type: "string" },
                          rating: { type: "integer" },
                          comment: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Product not found",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Product: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          discount: {
            type: "object",
            properties: {
              isDiscounted: { type: "boolean" },
              percentage: { type: "number" },
            },
          },
          bottleSize: {
            type: "string",
            enum: ["30ml", "50ml", "75ml", "100ml"],
          },
          category: { type: "string" },
          tags: {
            type: "array",
            items: { type: "string" },
          },
          stock: { type: "integer" },
          images: {
            type: "array",
            items: {
              type: "object",
              properties: {
                publicId: { type: "string" },
                url: { type: "string" },
              },
            },
          },
          ratings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                userId: { type: "string" },
                rating: { type: "integer" },
                comment: { type: "string" },
              },
            },
          },
          likedBy: {
            type: "array",
            items: { type: "string" },
          },
          inStock: { type: "boolean" },
          averageRating: { type: "number" },
          soldOut: { type: "boolean" },
          likesCount: { type: "integer" },
          isActive: { type: "boolean" },
          archived: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};

export default productSpec;
