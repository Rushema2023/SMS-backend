import "./types/express";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import itemRoutes from "./routes/item.routes";

export const app = express();

app.use(cors());
app.use(express.json());

// Interactive API docs, generated from the @openapi comments in src/routes.
// Visit http://localhost:4000/docs once the server is running.
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to Stock Management APIs" });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);

// Catch-all for unmatched routes.
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});
