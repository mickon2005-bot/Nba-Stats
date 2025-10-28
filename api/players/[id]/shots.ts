import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchStatsNBA, handleError } from '../../lib/stats-nba';

interface ShotData {
  LOC_X: number;
  LOC_Y: number;
  SHOT_MADE_FLAG: number;
  SHOT_TYPE: string;
  SHOT_ZONE_BASIC: string;
  SHOT_DISTANCE: number;
}

function generateFallbackShots(playerId: string): ShotData[] {
  const shots: ShotData[] = [];
  const zones = [
    { name: 'Paint', xRange: [-80, 80], yRange: [0, 100], makeRate: 0.55 },
    { name: 'Mid-Range', xRange: [-180, 180], yRange: [100, 200], makeRate: 0.42 },
    { name: 'Three-Point', xRange: [-220, 220], yRange: [200, 280], makeRate: 0.36 },
  ];

  zones.forEach(zone => {
    const shotsInZone = 15 + Math.floor(Math.random() * 15);
    for (let i = 0; i < shotsInZone; i++) {
      const made = Math.random() < zone.makeRate;
      shots.push({
        LOC_X: zone.xRange[0] + Math.random() * (zone.xRange[1] - zone.xRange[0]),
        LOC_Y: zone.yRange[0] + Math.random() * (zone.yRange[1] - zone.yRange[0]),
        SHOT_MADE_FLAG: made ? 1 : 0,
        SHOT_TYPE: zone.name.includes('Three') ? '3PT' : '2PT',
        SHOT_ZONE_BASIC: zone.name,
        SHOT_DISTANCE: Math.floor(Math.random() * 30),
      });
    }
  });

  return shots;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    const data = await fetchStatsNBA('shotchartdetail', {
      PlayerID: String(id),
      Season: '2024-25',
      SeasonType: 'Regular Season',
      TeamID: 0,
      GameID: '',
      Outcome: '',
      Location: '',
      Month: 0,
      SeasonSegment: '',
      DateFrom: '',
      DateTo: '',
      OpponentTeamID: 0,
      VsConference: '',
      VsDivision: '',
      Position: '',
      RookieYear: '',
      GameSegment: '',
      Period: 0,
      LastNGames: 0,
      ContextMeasure: 'FGA',
    });

    const shots = data.resultSets?.[0];
    if (!shots || !shots.rowSet || shots.rowSet.length === 0) {
      throw new Error('No shot data available');
    }

    const headers = shots.headers;
    const rows = shots.rowSet;

    const shotData = rows.map((row: any[]) => {
      const shot: any = {};
      headers.forEach((header: string, index: number) => {
        shot[header] = row[index];
      });
      return shot;
    });

    return res.status(200).json(shotData);
  } catch (error: any) {
    console.log('Using fallback shot data for player:', req.query.id);
    return handleError(res, error, generateFallbackShots(String(req.query.id)));
  }
}
