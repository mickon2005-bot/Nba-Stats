import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchStatsNBA, handleError } from '../lib/stats-nba';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const season = (req.query.season as string) || '2024-25';

  try {
    const data = await fetchStatsNBA('leaguedashplayerstats', {
      College: '',
      Conference: '',
      Country: '',
      DateFrom: '',
      DateTo: '',
      Division: '',
      DraftPick: '',
      DraftYear: '',
      GameScope: '',
      GameSegment: '',
      Height: '',
      LastNGames: 0,
      LeagueID: '00',
      Location: '',
      MeasureType: 'Base',
      Month: 0,
      OpponentTeamID: 0,
      Outcome: '',
      PORound: 0,
      PaceAdjust: 'N',
      PerMode: 'PerGame',
      Period: 0,
      PlayerExperience: '',
      PlayerPosition: '',
      PlusMinus: 'N',
      Rank: 'N',
      Season: season,
      SeasonSegment: '',
      SeasonType: 'Regular Season',
      ShotClockRange: '',
      StarterBench: '',
      TeamID: 0,
      TwoWay: 0,
      VsConference: '',
      VsDivision: '',
      Weight: '',
    });

    const playerStats = data.resultSets?.[0];
    if (!playerStats) {
      throw new Error('No player stats data');
    }

    const headers = playerStats.headers;
    const rows = playerStats.rowSet;

    const players = rows.map((row: any[]) => {
      const player: any = {};
      headers.forEach((header: string, index: number) => {
        player[header] = row[index];
      });
      return player;
    });

    return res.status(200).json(players);
  } catch (error: any) {
    return handleError(res, error, []);
  }
}
