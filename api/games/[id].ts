import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchBallDontLie } from '../lib/balldontlie';
import { handleError } from '../lib/stats-nba';

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
    
    const data = await fetchBallDontLie(`games/${id}`, {});
    
    return res.status(200).json(data);
  } catch (error: any) {
    return handleError(res, error);
  }
}
