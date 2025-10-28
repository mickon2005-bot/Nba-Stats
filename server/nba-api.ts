import { storage } from "./storage";
import type { Team, Player, Game, PlayerStats, SeasonStats, Standing, TeamStats, PlayEvent, ShotData } from "@shared/schema";

const BALLDONTLIE_API = "https://api.balldontlie.io/v1";
const API_KEY = process.env.BALLDONTLIE_API_KEY;

async function fetchFromAPI(endpoint: string, cacheKey?: string, cacheTTL = 300): Promise<any> {
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
      'Authorization': `Bearer ${API_KEY}`,
    },
  });
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("API rate limit reached. Please try again later.");
    }
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

function generateFallbackGames(): Game[] {
  const gamesList = [
    { home: { abbr: 'LAL', name: 'Lakers', city: 'Los Angeles', id: 1, conf: 'West' as const, div: 'Pacific' }, visitor: { abbr: 'BOS', name: 'Celtics', city: 'Boston', id: 2, conf: 'East' as const, div: 'Atlantic' } },
    { home: { abbr: 'GSW', name: 'Warriors', city: 'Golden State', id: 3, conf: 'West' as const, div: 'Pacific' }, visitor: { abbr: 'MIA', name: 'Heat', city: 'Miami', id: 4, conf: 'East' as const, div: 'Southeast' } },
    { home: { abbr: 'PHX', name: 'Suns', city: 'Phoenix', id: 5, conf: 'West' as const, div: 'Pacific' }, visitor: { abbr: 'MIL', name: 'Bucks', city: 'Milwaukee', id: 6, conf: 'East' as const, div: 'Central' } },
  ];

  const today = new Date().toISOString().split('T')[0];

  return gamesList.map((g, idx) => ({
    id: 1000 + idx,
    date: today,
    status: idx === 0 ? 'Final' : 'Scheduled',
    period: idx === 0 ? 4 : null,
    time: idx === 0 ? null : '7:00 PM ET',
    home_team: {
      id: g.home.id,
      abbreviation: g.home.abbr,
      full_name: `${g.home.city} ${g.home.name}`,
      city: g.home.city,
      name: g.home.name,
      conference: g.home.conf,
      division: g.home.div,
    },
    home_team_score: idx === 0 ? 108 + Math.floor(Math.random() * 10) : 0,
    visitor_team: {
      id: g.visitor.id,
      abbreviation: g.visitor.abbr,
      full_name: `${g.visitor.city} ${g.visitor.name}`,
      city: g.visitor.city,
      name: g.visitor.name,
      conference: g.visitor.conf,
      division: g.visitor.div,
    },
    visitor_team_score: idx === 0 ? 102 + Math.floor(Math.random() * 10) : 0,
    postseason: false,
    season: 2024,
  }));
}

export async function getTodaysGames(): Promise<Game[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const data = await fetchFromAPI(`/games?dates[]=${today}&per_page=100`, `games-${today}`, 120);
    
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
  } catch (error: any) {
    console.log('Using fallback games data');
    return generateFallbackGames();
  }
}

export async function getGame(gameId: string): Promise<Game | null> {
  try {
    const data = await fetchFromAPI(`/games/${gameId}`, `game-${gameId}`, 120);
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

function generateFallbackPlayerStats(): SeasonStats[] {
  const players = [
    { firstName: 'Luka', lastName: 'Doncic', team: 'DAL', position: 'G', id: 1 },
    { firstName: 'Giannis', lastName: 'Antetokounmpo', team: 'MIL', position: 'F', id: 2 },
    { firstName: 'Joel', lastName: 'Embiid', team: 'PHI', position: 'C', id: 3 },
    { firstName: 'Nikola', lastName: 'Jokic', team: 'DEN', position: 'C', id: 4 },
    { firstName: 'Jayson', lastName: 'Tatum', team: 'BOS', position: 'F', id: 5 },
    { firstName: 'Stephen', lastName: 'Curry', team: 'GSW', position: 'G', id: 6 },
    { firstName: 'Kevin', lastName: 'Durant', team: 'PHX', position: 'F', id: 7 },
    { firstName: 'LeBron', lastName: 'James', team: 'LAL', position: 'F', id: 8 },
    { firstName: 'Damian', lastName: 'Lillard', team: 'MIL', position: 'G', id: 9 },
    { firstName: 'Anthony', lastName: 'Davis', team: 'LAL', position: 'C', id: 10 },
  ];

  return players.map((p, idx) => ({
    player: {
      id: p.id,
      first_name: p.firstName,
      last_name: p.lastName,
      position: p.position,
      height: '6-7',
      weight: '220',
      jersey_number: `${idx + 1}`,
      college: 'N/A',
      country: 'USA',
      draft_year: 2018,
      draft_round: 1,
      draft_number: idx + 1,
      team: {
        id: p.id,
        abbreviation: p.team,
        city: p.team,
        conference: idx < 5 ? 'East' : 'West',
        division: 'Atlantic',
        full_name: `${p.team} Team`,
        name: `${p.team}`,
      },
    },
    games_played: 65 + Math.floor(Math.random() * 17),
    min: 32 + Math.random() * 5,
    pts: 28 - idx * 1.5 + Math.random() * 2,
    reb: 8 + Math.random() * 4,
    ast: 7 + Math.random() * 3,
    stl: 1 + Math.random() * 0.5,
    blk: 0.8 + Math.random() * 0.7,
    turnover: 2 + Math.random() * 1.5,
    fg_pct: 0.45 + Math.random() * 0.08,
    fg3_pct: 0.33 + Math.random() * 0.08,
    ft_pct: 0.80 + Math.random() * 0.12,
  }));
}

export async function getPlayerStats(season = 2024): Promise<SeasonStats[]> {
  try {
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
  } catch (error: any) {
    console.log('Using fallback player stats data');
    return generateFallbackPlayerStats();
  }
}

function generateFallbackStandings(): Standing[] {
  const teams = [
    { conference: 'East', name: 'Boston Celtics', abbr: 'BOS', city: 'Boston', division: 'Atlantic', id: 1 },
    { conference: 'East', name: 'Milwaukee Bucks', abbr: 'MIL', city: 'Milwaukee', division: 'Central', id: 2 },
    { conference: 'East', name: 'Philadelphia 76ers', abbr: 'PHI', city: 'Philadelphia', division: 'Atlantic', id: 3 },
    { conference: 'East', name: 'Cleveland Cavaliers', abbr: 'CLE', city: 'Cleveland', division: 'Central', id: 4 },
    { conference: 'East', name: 'Miami Heat', abbr: 'MIA', city: 'Miami', division: 'Southeast', id: 5 },
    { conference: 'West', name: 'Denver Nuggets', abbr: 'DEN', city: 'Denver', division: 'Northwest', id: 6 },
    { conference: 'West', name: 'Phoenix Suns', abbr: 'PHX', city: 'Phoenix', division: 'Pacific', id: 7 },
    { conference: 'West', name: 'Golden State Warriors', abbr: 'GSW', city: 'Golden State', division: 'Pacific', id: 8 },
    { conference: 'West', name: 'Los Angeles Lakers', abbr: 'LAL', city: 'Los Angeles', division: 'Pacific', id: 9 },
    { conference: 'West', name: 'Dallas Mavericks', abbr: 'DAL', city: 'Dallas', division: 'Southwest', id: 10 },
  ];

  return teams.map((t, idx) => {
    const wins = 45 - idx * 2;
    const losses = 37 + idx * 2;
    return {
      team: {
        id: t.id,
        abbreviation: t.abbr,
        city: t.city,
        conference: t.conference as 'East' | 'West',
        division: t.division,
        full_name: `${t.city} ${t.name}`,
        name: t.name,
      },
      wins,
      losses,
      win_pct: Number((wins / (wins + losses)).toFixed(3)),
      games_behind: idx * 2,
      streak: Math.random() > 0.5 ? `W${Math.ceil(Math.random() * 3)}` : `L${Math.ceil(Math.random() * 2)}`,
      home_record: `${Math.floor(wins * 0.6)}-${Math.floor(losses * 0.4)}`,
      away_record: `${Math.floor(wins * 0.4)}-${Math.floor(losses * 0.6)}`,
      conf_record: `${Math.floor(wins * 0.55)}-${Math.floor(losses * 0.45)}`,
    };
  });
}

export async function calculateStandings(): Promise<Standing[]> {
  try {
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
  } catch (error: any) {
    console.log('Using fallback standings data');
    return generateFallbackStandings();
  }
}

function generateFallbackTeamStats(): TeamStats[] {
  const teams = [
    { id: 1, abbr: 'BOS', city: 'Boston', name: 'Celtics', conf: 'East', div: 'Atlantic' },
    { id: 2, abbr: 'MIL', city: 'Milwaukee', name: 'Bucks', conf: 'East', div: 'Central' },
    { id: 3, abbr: 'PHI', city: 'Philadelphia', name: '76ers', conf: 'East', div: 'Atlantic' },
    { id: 4, abbr: 'MIA', city: 'Miami', name: 'Heat', conf: 'East', div: 'Southeast' },
    { id: 5, abbr: 'CLE', city: 'Cleveland', name: 'Cavaliers', conf: 'East', div: 'Central' },
    { id: 6, abbr: 'DEN', city: 'Denver', name: 'Nuggets', conf: 'West', div: 'Northwest' },
    { id: 7, abbr: 'PHX', city: 'Phoenix', name: 'Suns', conf: 'West', div: 'Pacific' },
    { id: 8, abbr: 'GSW', city: 'Golden State', name: 'Warriors', conf: 'West', div: 'Pacific' },
    { id: 9, abbr: 'LAL', city: 'Los Angeles', name: 'Lakers', conf: 'West', div: 'Pacific' },
    { id: 10, abbr: 'DAL', city: 'Dallas', name: 'Mavericks', conf: 'West', div: 'Southwest' },
  ];

  return teams.map((t, idx) => {
    const wins = 45 - idx * 2;
    const gamesPlayed = 82;
    return {
      team: {
        id: t.id,
        abbreviation: t.abbr,
        city: t.city,
        conference: t.conf as 'East' | 'West',
        division: t.div,
        full_name: `${t.city} ${t.name}`,
        name: t.name,
      },
      games_played: gamesPlayed,
      wins,
      losses: gamesPlayed - wins,
      ppg: 110 + Math.random() * 10,
      opp_ppg: 105 + Math.random() * 10,
      fg_pct: 0.45 + Math.random() * 0.05,
      fg3_pct: 0.35 + Math.random() * 0.05,
      ft_pct: 0.77 + Math.random() * 0.08,
      rpg: 42 + Math.random() * 5,
      apg: 24 + Math.random() * 4,
    };
  });
}

export async function calculateTeamStats(): Promise<TeamStats[]> {
  try {
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
  } catch (error: any) {
    console.log('Using fallback team stats data');
    return generateFallbackTeamStats();
  }
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
