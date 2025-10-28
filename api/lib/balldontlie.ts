// BallDontLie API client for Vercel serverless functions
const API_KEY = process.env.BALLDONTLIE_API_KEY || '';
const BASE_URL = 'https://api.balldontlie.io/v1';

export async function fetchBallDontLie(endpoint: string, params: Record<string, string | number> = {}) {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`BallDontLie API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
