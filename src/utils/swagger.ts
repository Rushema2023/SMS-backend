import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Stock Management System API",
      version: "1.0.0",
      description: "Multi-organization stock management backend — organizations, users, and items.",
    },
    servers: [{ url: "", description: "API base path" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Item: {
          type: "object",
          required: ["id", "name", "sku", "quantity", "unit", "organizationId", "createdAt", "updatedAt"],
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Wireless Mouse" },
            sku: { type: "string", example: "MOUSE-001" },
            quantity: { type: "integer", minimum: 0, example: 25 },
            unit: { type: "string", example: "pcs" },
            organizationId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateItemInput: {
          type: "object",
          required: ["name", "sku"],
          properties: {
            name: { type: "string", maxLength: 120, example: "Wireless Mouse" },
            sku: { type: "string", maxLength: 80, example: "MOUSE-001" },
            quantity: { type: "integer", minimum: 0, default: 0, example: 25 },
            unit: { type: "string", maxLength: 30, default: "pcs", example: "pcs" },
          },
        },
        UpdateItemInput: {
          type: "object",
          minProperties: 1,
          properties: {
            name: { type: "string", maxLength: 120, example: "Ergonomic Wireless Mouse" },
            sku: { type: "string", maxLength: 80, example: "MOUSE-001" },
            quantity: { type: "integer", minimum: 0, example: 30 },
            unit: { type: "string", maxLength: 30, example: "pcs" },
          },
        },
        Error: {
          type: "object",
          required: ["error"],
          properties: { error: { type: "string" } },
        },
      },
    },
  },
  // swagger-jsdoc reads the @openapi comment blocks in these files
  // and turns them into the interactive docs at /docs.
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
