import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import playersRoutes from "./routes/players.ts";
import gamesRoutes from "./routes/games.ts";
import statsRoutes from "./routes/stats.ts";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "http://localhost:4321", // Astro dev server
    credentials: true,
  })
);

app.route("/api/players", playersRoutes);
app.route("/api/games", gamesRoutes);
app.route("/api/stats", statsRoutes);

app.get("/", (c) => c.text("7 Wonders Tracker API"));

export default {
  port: process.env.PORT || 3001,
  fetch: app.fetch,
};
