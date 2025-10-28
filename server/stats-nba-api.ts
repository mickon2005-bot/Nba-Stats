import { storage } from "./storage";
import type { ShotData, PlayEvent } from "@shared/schema";

const STATS_NBA_API = "https://stats.nba.com/stats";

const headers: Record<string, string> = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'https://www.nba.com/',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Origin': 'https://www.nba.com',
  'Connection': 'keep-alive',
};

async function fetchFromStatsNBA(endpoint: string, params: Record<string, string>, cacheKey?: string, cacheTTL = 300): Promise<any> {
  if (cacheKey) {
    const cached = storage.getCached(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const queryParams = new URLSearchParams(params).toString();
  const url = `${STATS_NBA_API}/${endpoint}?${queryParams}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      headers,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Stats NBA API rate limit reached. Please try again later.");
      }
      throw new Error(`Stats NBA API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (cacheKey && data) {
      storage.setCached(cacheKey, data, cacheTTL);
    }

    return data;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.log(`Stats NBA API timeout for ${endpoint} (stats.nba.com may be blocked)`);
    } else {
      console.error(`Stats NBA API error for ${endpoint}:`, error);
    }
    throw error;
  }
}

export async function getRealShotChartData(playerId: string, season: string = '2024-25'): Promise<ShotData[]> {
  const cacheKey = `shot-chart-${playerId}-${season}`;
  const cached = storage.getCached<ShotData[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchFromStatsNBA(
      'shotchartdetail',
      {
        'PlayerID': playerId,
        'TeamID': '0',
        'Season': season,
        'SeasonType': 'Regular Season',
        'ContextMeasure': 'FGA',
        'LeagueID': '00',
        'LastNGames': '0',
        'Month': '0',
        'OpponentTeamID': '0',
        'Period': '0',
      },
      cacheKey,
      3600
    );

    if (!data?.resultSets?.[0]?.rowSet) {
      return [];
    }

    const headers = data.resultSets[0].headers;
    const rows = data.resultSets[0].rowSet;

    const locXIndex = headers.indexOf('LOC_X');
    const locYIndex = headers.indexOf('LOC_Y');
    const madeIndex = headers.indexOf('SHOT_MADE_FLAG');
    const distanceIndex = headers.indexOf('SHOT_DISTANCE');
    const shotTypeIndex = headers.indexOf('SHOT_TYPE');
    const zoneIndex = headers.indexOf('SHOT_ZONE_BASIC');

    const shots: ShotData[] = rows.map((row: any[]) => {
      const locX = row[locXIndex] / 10;
      const locY = row[locYIndex] / 10 + 5;
      
      const normalizedX = (locX + 25) * (50 / 50);
      const normalizedY = locY * (47 / 47);

      return {
        x: normalizedX,
        y: normalizedY,
        made: row[madeIndex] === 1,
        distance: row[distanceIndex] || 0,
        shot_type: row[shotTypeIndex] || 'Unknown',
        zone: row[zoneIndex] || 'Unknown',
      };
    });

    storage.setCached(cacheKey, shots, 3600);
    return shots;
  } catch (error) {
    console.error('Failed to fetch real shot chart data:', error);
    return [];
  }
}

export async function getPlayerGameLog(playerId: string, season: string = '2024-25'): Promise<any[]> {
  const cacheKey = `player-gamelog-${playerId}-${season}`;
  const cached = storage.getCached<any[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchFromStatsNBA(
      'playergamelog',
      {
        'PlayerID': playerId,
        'Season': season,
        'SeasonType': 'Regular Season',
        'LeagueID': '00',
      },
      cacheKey,
      3600
    );

    if (!data?.resultSets?.[0]?.rowSet) {
      return [];
    }

    const headers = data.resultSets[0].headers;
    const rows = data.resultSets[0].rowSet;

    const gameIdIndex = headers.indexOf('Game_ID');
    const gameDateIndex = headers.indexOf('GAME_DATE');
    const matchupIndex = headers.indexOf('MATCHUP');
    const wlIndex = headers.indexOf('WL');
    const minIndex = headers.indexOf('MIN');
    const ptsIndex = headers.indexOf('PTS');
    const rebIndex = headers.indexOf('REB');
    const astIndex = headers.indexOf('AST');
    const stlIndex = headers.indexOf('STL');
    const blkIndex = headers.indexOf('BLK');
    const fgPctIndex = headers.indexOf('FG_PCT');
    const fg3PctIndex = headers.indexOf('FG3_PCT');

    const games = rows.slice(0, 20).map((row: any[]) => ({
      game_id: row[gameIdIndex],
      date: row[gameDateIndex],
      matchup: row[matchupIndex],
      result: row[wlIndex],
      minutes: parseFloat(row[minIndex]) || 0,
      points: row[ptsIndex] || 0,
      rebounds: row[rebIndex] || 0,
      assists: row[astIndex] || 0,
      steals: row[stlIndex] || 0,
      blocks: row[blkIndex] || 0,
      fg_pct: row[fgPctIndex] || 0,
      fg3_pct: row[fg3PctIndex] || 0,
    }));

    storage.setCached(cacheKey, games, 3600);
    return games;
  } catch (error) {
    console.error('Failed to fetch player game log:', error);
    return [];
  }
}

function parseGameClock(clockValue: any): string {
  if (typeof clockValue === 'string' && clockValue.startsWith('PT')) {
    const match = clockValue.match(/PT(\d+)M([\d.]+)S/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = Math.floor(parseFloat(match[2]));
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return '0:00';
  }
  
  if (typeof clockValue === 'number') {
    const minutes = Math.floor(clockValue / 60);
    const seconds = clockValue % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return String(clockValue || '0:00');
}

export async function getPlayByPlayData(gameId: string): Promise<PlayEvent[]> {
  const cacheKey = `playbyplay-${gameId}`;
  const cached = storage.getCached<PlayEvent[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchFromStatsNBA(
      'playbyplayv3',
      {
        'GameID': gameId,
        'LeagueID': '00',
      },
      cacheKey,
      300
    );

    if (!data?.game?.actions) {
      return [];
    }

    const actions = data.game.actions.slice(0, 100);

    const plays: PlayEvent[] = actions.map((action: any, index: number) => {
      const clock = parseGameClock(action.clock);

      return {
        id: `${gameId}-${action.actionNumber || index}`,
        game_id: parseInt(gameId),
        period: action.period || 1,
        clock,
        description: action.description || 'Unknown play',
        player_id: action.personId || null,
        team_id: action.teamId || null,
        event_type: action.actionType || 'unknown',
        score_home: action.scoreHome || 0,
        score_away: action.scoreAway || 0,
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
      };
    });

    storage.setCached(cacheKey, plays, 300);
    return plays;
  } catch (error) {
    console.error('Failed to fetch play-by-play data:', error);
    return [];
  }
}

export async function getPlayerInfo(playerId: string): Promise<any> {
  const cacheKey = `player-info-${playerId}`;
  const cached = storage.getCached(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchFromStatsNBA(
      'commonplayerinfo',
      {
        'PlayerID': playerId,
        'LeagueID': '00',
      },
      cacheKey,
      86400
    );

    if (!data?.resultSets?.[0]?.rowSet?.[0]) {
      return null;
    }

    const headers = data.resultSets[0].headers;
    const row = data.resultSets[0].rowSet[0];

    const info: any = {};
    headers.forEach((header: string, index: number) => {
      info[header.toLowerCase()] = row[index];
    });

    storage.setCached(cacheKey, info, 86400);
    return info;
  } catch (error) {
    console.error('Failed to fetch player info:', error);
    return null;
  }
}
