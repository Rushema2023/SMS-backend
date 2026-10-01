import swaggerJsdoc from "swagger-jsdoc";
import path from "node:path";

const routeFileExtension = path.extname(__filename) === ".ts" ? "ts" : "js";
const routeDocumentationGlob = path
  .join(__dirname, `../routes/*.${routeFileExtension}`)
  .replace(/\\/g, "/");

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
        Organization: {
          type: "object",
          required: ["id", "name"],
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Acme Ltd" },
          },
        },
        User: {
          type: "object",
          required: ["id", "name", "email", "role", "organizationId", "createdAt"],
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Jane Doe" },
            email: { type: "string", format: "email", example: "jane@acme.com" },
            role: { type: "string", enum: ["ADMIN", "STAFF"], example: "ADMIN" },
            organizationId: {
              type: "string",
              format: "uuid",
              description: "The API representation of the users.organization_id database column.",
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
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
        UpdateUserInput: {
          type: "object",
          minProperties: 1,
          properties: {
            name: { type: "string", minLength: 2, example: "Updated Name" },
            email: { type: "string", format: "email", example: "updated@example.com" },
            role: { type: "string", enum: ["ADMIN", "STAFF"], example: "STAFF" },
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
  // Resolve from this module so docs work when running either TypeScript from
  // src or compiled JavaScript from dist, regardless of the process CWD.
  apis: [routeDocumentationGlob],
};

export const swaggerSpec = swaggerJsdoc(options);
