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
    const { id } = req.query;
    
    const data = await fetchStatsNBA('boxscoresummaryv2', {
      GameID: String(id),
    });

    const gameInfo = data.resultSets?.find((rs: any) => rs.name === 'GameSummary');
    const lineScore = data.resultSets?.find((rs: any) => rs.name === 'LineScore');

    if (!gameInfo || !lineScore) {
      throw new Error('Game not found');
    }

    const gameRow = gameInfo.rowSet[0];
    const homeScore = lineScore.rowSet.find((ls: any[]) => ls[3] === gameRow[6]);
    const visitorScore = lineScore.rowSet.find((ls: any[]) => ls[3] === gameRow[7]);

    const game = {
      id: gameRow[2],
      date: gameRow[0],
      status: gameRow[4],
      period: gameRow[5] || 0,
      time: gameRow[12] || '',
      home_team: {
        id: gameRow[6],
        abbreviation: homeScore?.[4] || '',
        full_name: homeScore?.[5] || '',
        city: homeScore?.[6] || '',
        name: homeScore?.[5] || '',
      },
      home_team_score: homeScore?.[22] || 0,
      visitor_team: {
        id: gameRow[7],
        abbreviation: visitorScore?.[4] || '',
        full_name: visitorScore?.[5] || '',
        city: visitorScore?.[6] || '',
        name: visitorScore?.[5] || '',
      },
      visitor_team_score: visitorScore?.[22] || 0,
      postseason: gameRow[11] || false,
      season: 2024,
    };

    return res.status(200).json(game);
  } catch (error: any) {
    return handleError(res, error);
  }
}
