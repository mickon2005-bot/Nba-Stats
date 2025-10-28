import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchStatsNBA, handleError } from '../../lib/stats-nba';

function generateFallbackPlays() {
  const events = [
    'Made shot',
    'Missed shot',
    'Rebound',
    'Assist',
    'Turnover',
    'Foul',
    'Free throw made',
    'Free throw missed',
  ];

  const plays = [];
  let clock = 720; // 12 minutes in seconds

  for (let i = 0; i < 50; i++) {
    clock -= Math.floor(Math.random() * 30) + 10;
    if (clock < 0) clock = 0;

    plays.push({
      EVENTNUM: i + 1,
      PCTIMESTRING: `${Math.floor(clock / 60)}:${(clock % 60).toString().padStart(2, '0')}`,
      HOMEDESCRIPTION: Math.random() > 0.5 ? events[Math.floor(Math.random() * events.length)] : null,
      VISITORDESCRIPTION: Math.random() > 0.5 ? events[Math.floor(Math.random() * events.length)] : null,
      SCORE: `${50 + i}-${48 + i}`,
    });
  }

  return plays.reverse();
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

    const data = await fetchStatsNBA('playbyplayv2', {
      GameID: String(id),
      StartPeriod: 0,
      EndPeriod: 10,
    });

    const playByPlay = data.resultSets?.[0];
    if (!playByPlay || !playByPlay.rowSet || playByPlay.rowSet.length === 0) {
      throw new Error('No play-by-play data');
    }

    const headers = playByPlay.headers;
    const rows = playByPlay.rowSet;

    const plays = rows.map((row: any[]) => {
      const play: any = {};
      headers.forEach((header: string, index: number) => {
        play[header] = row[index];
      });
      return play;
    });

    return res.status(200).json(plays);
  } catch (error: any) {
    console.log('Using fallback play-by-play for game:', req.query.id);
    return handleError(res, error, generateFallbackPlays());
  }
}
