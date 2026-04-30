import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import bandRoutes from "./routes/bands.js";
import dashboardRoutes from "./routes/dashboard.js";
import eventRoutes from "./routes/events.js";
import posterRoutes from "./routes/posters.js";
import savedEventRoutes from "./routes/savedEvents.js";
import venueRoutes from "./routes/venues.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "SceneForge API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bands", bandRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/posters", posterRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/saved-events", savedEventRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
