import { z } from "zod";

// Team schema
export const teamSchema = z.object({
  id: z.number(),
  abbreviation: z.string(),
  city: z.string(),
  conference: z.enum(["East", "West"]),
  division: z.string(),
  full_name: z.string(),
  name: z.string(),
});

export type Team = z.infer<typeof teamSchema>;

// Player schema
export const playerSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  position: z.string(),
  height: z.string().nullable(),
  weight: z.string().nullable(),
  jersey_number: z.string().nullable(),
  college: z.string().nullable(),
  country: z.string().nullable(),
  draft_year: z.number().nullable(),
  draft_round: z.number().nullable(),
  draft_number: z.number().nullable(),
  team: teamSchema,
});

export type Player = z.infer<typeof playerSchema>;

// Player stats schema
export const playerStatsSchema = z.object({
  id: z.number(),
  player: playerSchema,
  game_id: z.number(),
  min: z.string().nullable(),
  fgm: z.number().nullable(),
  fga: z.number().nullable(),
  fg_pct: z.number().nullable(),
  fg3m: z.number().nullable(),
  fg3a: z.number().nullable(),
  fg3_pct: z.number().nullable(),
  ftm: z.number().nullable(),
  fta: z.number().nullable(),
  ft_pct: z.number().nullable(),
  oreb: z.number().nullable(),
  dreb: z.number().nullable(),
  reb: z.number().nullable(),
  ast: z.number().nullable(),
  stl: z.number().nullable(),
  blk: z.number().nullable(),
  turnover: z.number().nullable(),
  pf: z.number().nullable(),
  pts: z.number().nullable(),
});

export type PlayerStats = z.infer<typeof playerStatsSchema>;

// Game schema
export const gameSchema = z.object({
  id: z.number(),
  date: z.string(),
  season: z.number(),
  status: z.string(),
  period: z.number().nullable(),
  time: z.string().nullable(),
  postseason: z.boolean(),
  home_team: teamSchema,
  visitor_team: teamSchema,
  home_team_score: z.number(),
  visitor_team_score: z.number(),
});

export type Game = z.infer<typeof gameSchema>;

// Standing schema (computed)
export const standingSchema = z.object({
  team: teamSchema,
  wins: z.number(),
  losses: z.number(),
  win_pct: z.number(),
  games_behind: z.number(),
  streak: z.string(),
  home_record: z.string(),
  away_record: z.string(),
  conf_record: z.string(),
});

export type Standing = z.infer<typeof standingSchema>;

// Shot chart data point
export const shotDataSchema = z.object({
  x: z.number(), // Court x coordinate (0-50)
  y: z.number(), // Court y coordinate (0-47)
  made: z.boolean(),
  distance: z.number(), // in feet
  shot_type: z.enum(["2PT", "3PT"]),
  zone: z.string(), // e.g., "Paint", "Mid-Range", "Corner 3", etc.
});

export type ShotData = z.infer<typeof shotDataSchema>;

// Play-by-play event
export const playEventSchema = z.object({
  id: z.string(),
  game_id: z.number(),
  period: z.number(),
  clock: z.string(),
  description: z.string(),
  player_id: z.number().nullable(),
  team_id: z.number().nullable(),
  event_type: z.string(),
  score_home: z.number(),
  score_away: z.number(),
  // Player positions for animation (simulated)
  home_positions: z.array(z.object({
    player_id: z.number(),
    x: z.number(),
    y: z.number(),
    jersey_number: z.string(),
  })).optional(),
  away_positions: z.array(z.object({
    player_id: z.number(),
    x: z.number(),
    y: z.number(),
    jersey_number: z.string(),
  })).optional(),
  ball_position: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
});

export type PlayEvent = z.infer<typeof playEventSchema>;

// Season stats aggregation
export const seasonStatsSchema = z.object({
  player: playerSchema,
  games_played: z.number(),
  min: z.number(),
  pts: z.number(),
  reb: z.number(),
  ast: z.number(),
  stl: z.number(),
  blk: z.number(),
  turnover: z.number(),
  fg_pct: z.number(),
  fg3_pct: z.number(),
  ft_pct: z.number(),
});

export type SeasonStats = z.infer<typeof seasonStatsSchema>;

// Team stats aggregation
export const teamStatsSchema = z.object({
  team: teamSchema,
  games_played: z.number(),
  wins: z.number(),
  losses: z.number(),
  ppg: z.number(), // points per game
  opp_ppg: z.number(), // opponent points per game
  fg_pct: z.number(),
  fg3_pct: z.number(),
  ft_pct: z.number(),
  rpg: z.number(), // rebounds per game
  apg: z.number(), // assists per game
});

export type TeamStats = z.infer<typeof teamStatsSchema>;
