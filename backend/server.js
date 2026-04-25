import "dotenv/config";
import express from "express";
import cors from "cors";

// Microservice routes
import authRoutes from "./services/auth/routes.js";
import cropsRoutes from "./services/crops/routes.js";
import ordersRoutes from "./services/orders/routes.js";
import usersRoutes from "./services/users/routes.js";
import cartRoutes from "./services/cart/routes.js";
import analyticsRoutes from "./services/analytics/routes.js";
import reportsRoutes from "./services/reports/routes.js";
import statsRoutes from "./services/stats/routes.js";
import settingsRoutes from "./services/settings/routes.js";

// Catch unhandled errors so the server doesn't exit silently
process.on('uncaughtException', err => { console.error('Uncaught Exception:', err); });
process.on('unhandledRejection', err => { console.error('Unhandled Rejection:', err); });

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://agri-chain-two.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "AgriChain API running", version: "1.0.0" });
});

// Mount microservices
app.use("/api/auth", authRoutes);
app.use("/api/crops", cropsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/settings", settingsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`AgriChain API running at http://localhost:${port}`);
  console.log(`Microservices: auth, crops, orders, users, cart, analytics, reports, stats, settings`);
});
