// Stats.NBA.com API client for Vercel serverless functions
import type { VercelRequest, VercelResponse } from '@vercel/node';

const STATS_NBA_BASE = 'https://stats.nba.com/stats';

// Browser-like headers to access stats.nba.com
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': 'https://www.nba.com/',
  'Origin': 'https://www.nba.com',
  'Connection': 'keep-alive',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site',
};

interface FetchOptions {
  timeout?: number;
  signal?: AbortSignal;
}

export async function fetchStatsNBA(endpoint: string, params: Record<string, string | number> = {}, options: FetchOptions = {}) {
  const url = new URL(`${STATS_NBA_BASE}/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 8000);

  try {
    const response = await fetch(url.toString(), {
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Stats.NBA API error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Stats.NBA API timeout');
    }
    throw error;
  }
}

export function handleError(res: VercelResponse, error: any, fallbackData?: any) {
  console.error('API Error:', error);
  
  if (fallbackData) {
    return res.status(200).json(fallbackData);
  }
  
  return res.status(500).json({
    error: error.message || 'Internal server error',
    fallback: true
  });
}
