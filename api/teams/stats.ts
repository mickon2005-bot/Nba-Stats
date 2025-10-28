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

  try {
    const data = await fetchStatsNBA('leaguedashteamstats', {
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
      Season: '2024-25',
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

    const teamStats = data.resultSets?.[0];
    if (!teamStats) {
      throw new Error('No team stats data');
    }

    const headers = teamStats.headers;
    const rows = teamStats.rowSet;

    const teams = rows.map((row: any[]) => {
      const team: any = {};
      headers.forEach((header: string, index: number) => {
        team[header] = row[index];
      });
      return team;
    });

    return res.status(200).json(teams);
  } catch (error: any) {
    return handleError(res, error, []);
  }
}
