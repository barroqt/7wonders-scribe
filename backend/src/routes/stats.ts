import { Hono } from "hono";
import { prisma } from "../db";

const app = new Hono();

// Get player stats
app.get("/players", async (c) => {
  try {
    const players = await prisma.player.findMany({
      include: {
        gameParticipants: {
          include: {
            game: {
              include: {
                participants: true,
              },
            },
          },
        },
      },
    });

    const playerStats = players.map((player) => {
      const totalGames = player.gameParticipants.length;

      if (totalGames === 0) {
        return {
          playerId: player.id,
          playerName: player.name,
          totalGames: 0,
          totalWins: 0,
          winRate: 0,
          averageScore: 0,
        };
      }

      const totalWins = player.gameParticipants.filter((participation) => {
        const gameParticipants = participation.game.participants;
        const maxScore = Math.max(...gameParticipants.map((p) => p.score));
        return participation.score === maxScore;
      }).length;

      const totalScore = player.gameParticipants.reduce(
        (sum, p) => sum + p.score,
        0
      );
      const averageScore = totalScore / totalGames;
      const winRate = (totalWins / totalGames) * 100;

      return {
        playerId: player.id,
        playerName: player.name,
        totalGames,
        totalWins,
        winRate: Math.round(winRate * 100) / 100,
        averageScore: Math.round(averageScore * 100) / 100,
      };
    });

    return c.json(playerStats.sort((a, b) => b.winRate - a.winRate));
  } catch (error) {
    return c.json({ error: "Failed to fetch player stats" }, 500);
  }
});

// Get wonder stats
app.get("/wonders", async (c) => {
  try {
    const gameParticipants = await prisma.gameParticipant.findMany({
      include: {
        game: {
          include: {
            participants: true,
          },
        },
      },
    });

    const wonderStatsMap = new Map();

    gameParticipants.forEach((participant) => {
      const wonder = participant.wonder;

      if (!wonderStatsMap.has(wonder)) {
        wonderStatsMap.set(wonder, {
          wonder,
          totalGames: 0,
          totalWins: 0,
          totalScore: 0,
        });
      }

      const stats = wonderStatsMap.get(wonder);
      stats.totalGames++;
      stats.totalScore += participant.score;

      // Check if this participant won
      const gameParticipants = participant.game.participants;
      const maxScore = Math.max(...gameParticipants.map((p) => p.score));
      if (participant.score === maxScore) {
        stats.totalWins++;
      }
    });

    const wonderStats = Array.from(wonderStatsMap.values()).map((stats) => ({
      wonder: stats.wonder,
      totalGames: stats.totalGames,
      totalWins: stats.totalWins,
      winRate: Math.round((stats.totalWins / stats.totalGames) * 10000) / 100,
      averageScore:
        Math.round((stats.totalScore / stats.totalGames) * 100) / 100,
    }));

    return c.json(wonderStats.sort((a, b) => b.winRate - a.winRate));
  } catch (error) {
    return c.json({ error: "Failed to fetch wonder stats" }, 500);
  }
});

export default app;
