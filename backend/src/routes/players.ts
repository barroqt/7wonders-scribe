import { Hono } from "hono";
import { prisma } from "../db";
import { playerSchema } from "../../../shared/schemas";

const app = new Hono();

// Get all players
app.get("/", async (c) => {
  try {
    const allPlayers = await prisma.player.findMany({
      orderBy: { name: "asc" },
    });
    return c.json(allPlayers);
  } catch (error) {
    return c.json({ error: "Failed to fetch players" }, 500);
  }
});

// Create player
app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = playerSchema.parse(body);

    const newPlayer = await prisma.player.create({
      data: validatedData,
    });
    return c.json(newPlayer, 201);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Failed to create player" }, 500);
  }
});

export default app;
