import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchBallDontLie } from '../lib/balldontlie';
import { handleError } from '../lib/stats-nba';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    
    const data = await fetchBallDontLie('games', {
      'dates[]': today,
      per_page: 100,
    });

    return res.status(200).json(data.data || []);
  } catch (error: any) {
    return handleError(res, error, []);
  }
}
