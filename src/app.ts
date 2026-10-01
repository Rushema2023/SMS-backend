import "./types/express";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import itemRoutes from "./routes/item.routes";

export const app = express();

const corsOrigins = process.env.CORS_ORIGIN
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Allow the local frontend by default, while production can restrict this to
// one or more comma-separated frontend origins through CORS_ORIGIN.
app.use(cors({ origin: corsOrigins?.length ? corsOrigins : true }));
app.use(express.json());

// Interactive API docs, generated from the @openapi comments in src/routes.
// Visit http://localhost:4000/docs once the server is running.
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/openapi.json", (_req, res) => res.json(swaggerSpec));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to Stock Management APIs" });
});
app.get("/api", (_req, res) => {
  res.json({
    name: "Stock Management API",
    version: "1.0.0",
    documentation: "/docs",
    endpoints: {
      auth: "/api/auth",
      items: "/api/items",
      users: "/api/users",
    },
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);

// Catch-all for unmatched routes.
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});
