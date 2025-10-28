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
import {
  getRealShotChartData,
  getPlayerGameLog,
  getPlayByPlayData,
  getPlayerInfo
} from "./stats-nba-api";

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
      const gameId = req.params.id;
      
      const realPlays = await getPlayByPlayData(gameId);
      
      if (realPlays && realPlays.length > 0) {
        res.json(realPlays);
      } else {
        const mockPlays = generateMockPlayByPlay(parseInt(gameId));
        res.json(mockPlays);
      }
    } catch (error: any) {
      console.log('Play-by-play error, using mock data:', error);
      const mockPlays = generateMockPlayByPlay(parseInt(req.params.id));
      res.json(mockPlays);
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

  app.get("/api/players/:id/stats", async (req, res) => {
    try {
      const stats = await getPlayerStats();
      const playerStat = stats.find(s => s.player.id === parseInt(req.params.id));
      if (!playerStat) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(playerStat);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/players/:id/shots", async (req, res) => {
    try {
      const playerId = req.params.id;
      const season = req.query.season as string || '2024-25';
      
      const realShots = await getRealShotChartData(playerId, season);
      
      if (realShots && realShots.length > 0) {
        res.json(realShots);
      } else {
        const mockShots = generateMockShotChart(parseInt(playerId));
        res.json(mockShots);
      }
    } catch (error: any) {
      console.log('Shot chart error, using mock data:', error.message);
      const mockShots = generateMockShotChart(parseInt(req.params.id));
      res.json(mockShots);
    }
  });

  app.get("/api/players/:id/gamelog", async (req, res) => {
    try {
      const playerId = req.params.id;
      const season = req.query.season as string || '2024-25';
      
      const gamelog = await getPlayerGameLog(playerId, season);
      res.json(gamelog);
    } catch (error: any) {
      console.error('Failed to fetch game log:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/players/:id/info", async (req, res) => {
    try {
      const playerId = req.params.id;
      const info = await getPlayerInfo(playerId);
      
      if (!info) {
        const mockInfo = {
          display_first_last: "Player",
          display_last_comma_first: "Player, Sample",
          player_id: playerId,
          position: "G-F",
          height: "6-7",
          weight: "220",
          birthdate: "1990-01-01T00:00:00",
          country: "USA",
          school: "University",
          draft_year: "2012",
          draft_round: "1",
          draft_number: "15",
        };
        return res.json(mockInfo);
      }
      
      res.json(info);
    } catch (error: any) {
      console.log('Player info error, using mock data:', error.message);
      const mockInfo = {
        display_first_last: "Player",
        display_last_comma_first: "Player, Sample",
        player_id: req.params.id,
        position: "G-F",
        height: "6-7",
        weight: "220",
        birthdate: "1990-01-01T00:00:00",
        country: "USA",
        school: "University",
        draft_year: "2012",
        draft_round: "1",
        draft_number: "15",
      };
      res.json(mockInfo);
    }
  });

  app.get("/api/games/:id/plays/real", async (req, res) => {
    try {
      const gameId = req.params.id;
      const plays = await getPlayByPlayData(gameId);
      
      if (plays && plays.length > 0) {
        res.json(plays);
      } else {
        const mockPlays = generateMockPlayByPlay(parseInt(gameId));
        res.json(mockPlays);
      }
    } catch (error: any) {
      console.log('Play-by-play error, using mock data:', error.message);
      const mockPlays = generateMockPlayByPlay(parseInt(req.params.id));
      res.json(mockPlays);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
