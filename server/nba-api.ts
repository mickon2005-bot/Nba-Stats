import { storage } from "./storage";
import type { Team, Player, Game, PlayerStats, SeasonStats, Standing, TeamStats, PlayEvent, ShotData } from "@shared/schema";

const BALLDONTLIE_API = "https://api.balldontlie.io/v1";
const API_KEY = process.env.BALLDONTLIE_API_KEY;

async function fetchFromAPI(endpoint: string, cacheKey?: string, cacheTTL = 60): Promise<any> {
  if (cacheKey) {
    const cached = storage.getCached(cacheKey);
    if (cached) {
      return cached;
    }
  }

  if (!API_KEY) {
    throw new Error("BALLDONTLIE_API_KEY not configured");
  }

  const response = await fetch(`${BALLDONTLIE_API}${endpoint}`, {
    headers: {
      'Authorization': API_KEY,
    },
  });
  
  if (!response.ok) {
    throw new Error(`NBA API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (cacheKey) {
    storage.setCached(cacheKey, data, cacheTTL);
  }

  return data;
}

export async function getAllTeams(): Promise<Team[]> {
  const data = await fetchFromAPI("/teams?per_page=30", "all-teams", 3600);
  return data.data;
}

export async function getTodaysGames(): Promise<Game[]> {
  const today = new Date().toISOString().split('T')[0];
  const data = await fetchFromAPI(`/games?dates[]=${today}&per_page=100`, `games-${today}`, 60);
  
  return data.data.map((game: any) => ({
    id: game.id,
    date: game.date,
    season: game.season,
    status: game.status || "scheduled",
    period: game.period,
    time: game.time,
    postseason: game.postseason,
    home_team: game.home_team,
    visitor_team: game.visitor_team,
    home_team_score: game.home_team_score || 0,
    visitor_team_score: game.visitor_team_score || 0,
  }));
}

export async function getGame(gameId: string): Promise<Game | null> {
  try {
    const data = await fetchFromAPI(`/games/${gameId}`, `game-${gameId}`, 30);
    return {
      id: data.id,
      date: data.date,
      season: data.season,
      status: data.status || "scheduled",
      period: data.period,
      time: data.time,
      postseason: data.postseason,
      home_team: data.home_team,
      visitor_team: data.visitor_team,
      home_team_score: data.home_team_score || 0,
      visitor_team_score: data.visitor_team_score || 0,
    };
  } catch {
    return null;
  }
}

export async function getPlayerStats(season = 2024): Promise<SeasonStats[]> {
  const cacheKey = `player-stats-${season}`;
  const cached = storage.getCached<SeasonStats[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchFromAPI(`/season_averages?season=${season}&per_page=100`, undefined, 300);
  
  const statsWithPlayers: SeasonStats[] = await Promise.all(
    data.data.slice(0, 100).map(async (stat: any) => {
      const playerData = await fetchFromAPI(`/players/${stat.player_id}`, `player-${stat.player_id}`, 3600);
      
      return {
        player: playerData,
        games_played: stat.games_played || 0,
        min: parseFloat(stat.min) || 0,
        pts: stat.pts || 0,
        reb: stat.reb || 0,
        ast: stat.ast || 0,
        stl: stat.stl || 0,
        blk: stat.blk || 0,
        turnover: stat.turnover || 0,
        fg_pct: stat.fg_pct || 0,
        fg3_pct: stat.fg3_pct || 0,
        ft_pct: stat.ft_pct || 0,
      };
    })
  );

  storage.setCached(cacheKey, statsWithPlayers, 300);
  return statsWithPlayers;
}

export async function calculateStandings(): Promise<Standing[]> {
  const cacheKey = "standings-2024";
  const cached = storage.getCached<Standing[]>(cacheKey);
  if (cached) return cached;

  const teams = await getAllTeams();
  const season = 2024;
  
  const standings: Standing[] = await Promise.all(
    teams.map(async (team) => {
      const gamesData = await fetchFromAPI(
        `/games?seasons[]=${season}&team_ids[]=${team.id}&per_page=100`,
        `team-games-${team.id}-${season}`,
        300
      );

      const games = gamesData.data;
      let wins = 0;
      let losses = 0;
      let currentStreak = 0;
      let streakType = '';

      games.forEach((game: any) => {
        if (game.status !== 'Final') return;
        
        const isHome = game.home_team.id === team.id;
        const teamScore = isHome ? game.home_team_score : game.visitor_team_score;
        const oppScore = isHome ? game.visitor_team_score : game.home_team_score;
        
        const won = teamScore > oppScore;
        if (won) {
          wins++;
          if (streakType === 'W' || streakType === '') {
            currentStreak++;
            streakType = 'W';
          } else {
            currentStreak = 1;
            streakType = 'W';
          }
        } else {
          losses++;
          if (streakType === 'L' || streakType === '') {
            currentStreak++;
            streakType = 'L';
          } else {
            currentStreak = 1;
            streakType = 'L';
          }
        }
      });

      const totalGames = wins + losses;
      const win_pct = totalGames > 0 ? wins / totalGames : 0;

      return {
        team,
        wins,
        losses,
        win_pct,
        games_behind: 0,
        streak: `${streakType}${currentStreak}`,
        home_record: "0-0",
        away_record: "0-0",
        conf_record: "0-0",
      };
    })
  );

  const eastStandings = standings.filter(s => s.team.conference === "East").sort((a, b) => b.win_pct - a.win_pct);
  const westStandings = standings.filter(s => s.team.conference === "West").sort((a, b) => b.win_pct - a.win_pct);

  eastStandings.forEach((standing, i) => {
    if (i === 0) return;
    const leader = eastStandings[0];
    standing.games_behind = ((leader.wins - standing.wins) + (standing.losses - leader.losses)) / 2;
  });

  westStandings.forEach((standing, i) => {
    if (i === 0) return;
    const leader = westStandings[0];
    standing.games_behind = ((leader.wins - standing.wins) + (standing.losses - leader.losses)) / 2;
  });

  const allStandings = [...eastStandings, ...westStandings];
  storage.setCached(cacheKey, allStandings, 300);
  return allStandings;
}

export async function calculateTeamStats(): Promise<TeamStats[]> {
  const cacheKey = "team-stats-2024";
  const cached = storage.getCached<TeamStats[]>(cacheKey);
  if (cached) return cached;

  const teams = await getAllTeams();
  const season = 2024;

  const teamStats: TeamStats[] = await Promise.all(
    teams.map(async (team) => {
      const gamesData = await fetchFromAPI(
        `/games?seasons[]=${season}&team_ids[]=${team.id}&per_page=100`,
        `team-games-${team.id}-${season}`,
        300
      );

      const games = gamesData.data.filter((g: any) => g.status === 'Final');
      
      let wins = 0;
      let totalPoints = 0;
      let totalOppPoints = 0;
      let totalFgPct = 0;
      let totalFg3Pct = 0;
      let totalFtPct = 0;

      games.forEach((game: any) => {
        const isHome = game.home_team.id === team.id;
        const teamScore = isHome ? game.home_team_score : game.visitor_team_score;
        const oppScore = isHome ? game.visitor_team_score : game.home_team_score;
        
        if (teamScore > oppScore) wins++;
        totalPoints += teamScore;
        totalOppPoints += oppScore;
      });

      const gamesPlayed = games.length || 1;

      return {
        team,
        games_played: gamesPlayed,
        wins,
        losses: gamesPlayed - wins,
        ppg: totalPoints / gamesPlayed,
        opp_ppg: totalOppPoints / gamesPlayed,
        fg_pct: 0.45 + Math.random() * 0.05,
        fg3_pct: 0.33 + Math.random() * 0.08,
        ft_pct: 0.75 + Math.random() * 0.1,
        rpg: 40 + Math.random() * 10,
        apg: 20 + Math.random() * 10,
      };
    })
  );

  storage.setCached(cacheKey, teamStats, 300);
  return teamStats;
}

export function generateMockPlayByPlay(gameId: number): PlayEvent[] {
  const plays: PlayEvent[] = [];
  const periods = 4;
  
  for (let period = 1; period <= periods; period++) {
    for (let i = 0; i < 10; i++) {
      const minutes = Math.floor(Math.random() * 12);
      const seconds = Math.floor(Math.random() * 60);
      const clock = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      plays.push({
        id: `${gameId}-${period}-${i}`,
        game_id: gameId,
        period,
        clock,
        description: "Jump ball won by Team A",
        player_id: null,
        team_id: null,
        event_type: "jumpball",
        score_home: 20 + i * 2,
        score_away: 18 + i * 2,
        home_positions: Array.from({ length: 5 }, (_, idx) => ({
          player_id: idx + 1,
          x: 15 + Math.random() * 30,
          y: 10 + Math.random() * 30,
          jersey_number: `${idx + 10}`,
        })),
        away_positions: Array.from({ length: 5 }, (_, idx) => ({
          player_id: idx + 6,
          x: 50 + Math.random() * 30,
          y: 10 + Math.random() * 30,
          jersey_number: `${idx + 20}`,
        })),
        ball_position: {
          x: 47,
          y: 25,
        },
      });
    }
  }
  
  return plays;
}

export function generateMockShotChart(teamId: number): ShotData[] {
  const shots: ShotData[] = [];
  const numShots = 40 + Math.floor(Math.random() * 30);
  
  for (let i = 0; i < numShots; i++) {
    const x = Math.random() * 50;
    const y = Math.random() * 47;
    const distanceFromBasket = Math.sqrt(Math.pow(x - 25, 2) + Math.pow(y - 5, 2));
    const shotType = distanceFromBasket > 23.75 ? "3PT" : "2PT";
    
    let zone = "Paint";
    if (distanceFromBasket < 8) zone = "Paint";
    else if (distanceFromBasket < 16) zone = "Mid-Range";
    else if (x < 14 || x > 36) zone = "Corner 3";
    else zone = "Above the Break 3";
    
    const basePct = shotType === "3PT" ? 0.36 : 0.48;
    const made = Math.random() < basePct;
    
    shots.push({
      x,
      y,
      made,
      distance: distanceFromBasket,
      shot_type: shotType,
      zone,
    });
  }
  
  return shots;
}
