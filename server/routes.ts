import type { Express } from "express";
import { createServer, type Server } from "http";
import { 
  getTodaysGames, 
  getGame, 
  getPlayerStats, 
  calculateStandings, 
  calculateTeamStats,
  generateMockPlayByPlay,
  generateMockShotChart
} from "./nba-api";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/games/today", async (req, res) => {
    try {
      const games = await getTodaysGames();
      res.json(games);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const game = await getGame(req.params.id);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(game);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/games/:id/plays", async (req, res) => {
    try {
      const plays = generateMockPlayByPlay(parseInt(req.params.id));
      res.json(plays);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/games/:id/shots/:team", async (req, res) => {
    try {
      const shots = generateMockShotChart(parseInt(req.params.id));
      res.json(shots);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/standings", async (req, res) => {
    try {
      const standings = await calculateStandings();
      res.json(standings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/players/stats", async (req, res) => {
    try {
      const stats = await getPlayerStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/teams/stats", async (req, res) => {
    try {
      const stats = await calculateTeamStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
