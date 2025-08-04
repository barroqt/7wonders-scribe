import { z } from "zod";

export const WONDERS = [
  "Alexandria",
  "Babylon",
  "Ephesus",
  "Gizah",
  "Halikarnassos",
  "Olympia",
  "Rhodos",
] as const;

export const playerSchema = z.object({
  name: z.string().min(2).max(100),
});

export const gameParticipantSchema = z.object({
  playerId: z.number().int().positive(),
  wonder: z.enum(WONDERS),
  score: z.number().int().min(0),
});

export const gameSchema = z.object({
  participants: z.array(gameParticipantSchema).min(3).max(7),
});

export type Player = z.infer<typeof playerSchema>;
export type GameParticipant = z.infer<typeof gameParticipantSchema>;
export type Game = z.infer<typeof gameSchema>;
