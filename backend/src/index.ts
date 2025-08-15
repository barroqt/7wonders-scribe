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
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL || "7wonder-scribe-frontend.vercel.app"
        : "http://localhost:4321", // Astro dev server
    credentials: true,
  })
);

app.route("/api/players", playersRoutes);
app.route("/api/games", gamesRoutes);
app.route("/api/stats", statsRoutes);

app.get("/", (c) => c.text("7 Wonders Tracker API"));

// For Vercel serverless functions
export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const PATCH = app.fetch;
export const DELETE = app.fetch;

// For local development
if (import.meta.main) {
  const port = process.env.PORT || 3001;
  console.log(`Server running on port ${port}`);
  // Bun.serve is not needed as Vercel handles this
}
