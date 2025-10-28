import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchStatsNBA, handleError } from './lib/stats-nba';

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
    const data = await fetchStatsNBA('leaguestandingsv3', {
      LeagueID: '00',
      Season: '2024-25',
      SeasonType: 'Regular Season',
    });

    const standings = data.resultSets?.[0];
    if (!standings) {
      throw new Error('No standings data');
    }

    const headers = standings.headers;
    const rows = standings.rowSet;

    const teams = rows.map((row: any[]) => {
      const team: any = {};
      headers.forEach((header: string, index: number) => {
        team[header] = row[index];
      });
      return team;
    });

    const east = teams.filter((t: any) => t.Conference === 'East');
    const west = teams.filter((t: any) => t.Conference === 'West');

    return res.status(200).json({ East: east, West: west });
  } catch (error: any) {
    return handleError(res, error, {
      East: [],
      West: []
    });
  }
}
