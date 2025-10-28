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
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    
    const data = await fetchStatsNBA('scoreboardv2', {
      GameDate: today,
      LeagueID: '00',
      DayOffset: 0,
    });

    const gameHeader = data.resultSets?.find((rs: any) => rs.name === 'GameHeader');
    const lineScore = data.resultSets?.find((rs: any) => rs.name === 'LineScore');

    if (!gameHeader || !lineScore) {
      return res.status(200).json([]);
    }

    const games = gameHeader.rowSet.map((gameRow: any[]) => {
      const gameId = gameRow[2];
      const homeTeamId = gameRow[6];
      const visitorTeamId = gameRow[7];
      
      const homeScore = lineScore.rowSet.find((ls: any[]) => ls[3] === homeTeamId && ls[1] === gameId);
      const visitorScore = lineScore.rowSet.find((ls: any[]) => ls[3] === visitorTeamId && ls[1] === gameId);

      return {
        id: gameId,
        date: gameRow[0],
        status: gameRow[4],
        period: gameRow[5] || 0,
        time: gameRow[12] || '',
        home_team: {
          id: homeTeamId,
          abbreviation: homeScore?.[4] || '',
          full_name: homeScore?.[5] || '',
          city: homeScore?.[6] || '',
          name: homeScore?.[5] || '',
        },
        home_team_score: homeScore?.[22] || 0,
        visitor_team: {
          id: visitorTeamId,
          abbreviation: visitorScore?.[4] || '',
          full_name: visitorScore?.[5] || '',
          city: visitorScore?.[6] || '',
          name: visitorScore?.[5] || '',
        },
        visitor_team_score: visitorScore?.[22] || 0,
        postseason: gameRow[11] || false,
        season: 2024,
      };
    });

    return res.status(200).json(games);
  } catch (error: any) {
    return handleError(res, error, []);
  }
}
