import cors from "cors";
import express from "express";
import path from "path";
import { adminRouter } from "./routes/admin.routes";
import { authRouter } from "./routes/auth.routes";
import { bandsRouter } from "./routes/bands.routes";
import { dashboardRouter } from "./routes/dashboard.routes";
import { eventsRouter } from "./routes/events.routes";
import { postersRouter } from "./routes/posters.routes";
import { savedEventsRouter } from "./routes/savedEvents.routes";
import { venuesRouter } from "./routes/venues.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/posters", express.static(path.join(process.cwd(), "public/posters")));

app.get("/", (_req, res) => {
  res.send("SceneForge API is running");
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "SceneForge API is healthy" });
});

app.use("/api/auth", authRouter);
app.use("/api/events", eventsRouter);
app.use("/api/bands", bandsRouter);
app.use("/api/venues", venuesRouter);
app.use("/api/posters", postersRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/saved-events", savedEventsRouter);
app.use("/api/admin", adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
