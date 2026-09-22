import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Stock Management System API",
      version: "1.0.0",
      description: "Multi-organization stock management backend — organizations, users, and items.",
    },
    servers: [{ url: "/api", description: "API base path" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // swagger-jsdoc reads the @openapi comment blocks in these files
  // and turns them into the interactive docs at /docs.
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
