import { Hono } from "hono";
import { prisma } from "../db";
import { gameSchema } from "../../../shared/schemas";

const app = new Hono();

// Get all games with participants
app.get("/", async (c) => {
  try {
    const allGames = await prisma.game.findMany({
      include: {
        participants: {
          include: {
            player: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return c.json(allGames);
  } catch (error) {
    return c.json({ error: "Failed to fetch games" }, 500);
  }
});

// Create game
app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = gameSchema.parse(body);

    // Create game with participants in a transaction
    const newGame = await prisma.game.create({
      data: {
        participants: {
          create: validatedData.participants.map((p) => ({
            playerId: p.playerId,
            wonder: p.wonder,
            score: p.score,
          })),
        },
      },
      include: {
        participants: {
          include: {
            player: true,
          },
        },
      },
    });

    return c.json(newGame, 201);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Failed to create game" }, 500);
  }
});

// Delete game
app.delete("/:id", async (c) => {
  try {
    const gameId = parseInt(c.req.param("id"));
    await prisma.game.delete({
      where: { id: gameId },
    });
    return c.json({ message: "Game deleted successfully" });
  } catch (error) {
    return c.json({ error: "Failed to delete game" }, 500);
  }
});

export default app;
