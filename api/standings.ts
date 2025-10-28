import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchStatsNBA, handleError } from './lib/stats-nba';

interface TeamConference {
  id: number;
  abbreviation: string;
  city: string;
  conference: 'East' | 'West';
  division: string;
  full_name: string;
  name: string;
}

interface StandingData {
  team: TeamConference;
  wins: number;
  losses: number;
  win_pct: number;
  games_behind: number;
  streak: string;
  home_record: string;
  away_record: string;
  conf_record: string;
}

function generateFallbackStandings(): StandingData[] {
  const teams = [
    { conference: 'East', name: 'Boston Celtics', abbr: 'BOS', city: 'Boston', division: 'Atlantic' },
    { conference: 'East', name: 'Milwaukee Bucks', abbr: 'MIL', city: 'Milwaukee', division: 'Central' },
    { conference: 'East', name: 'Philadelphia 76ers', abbr: 'PHI', city: 'Philadelphia', division: 'Atlantic' },
    { conference: 'East', name: 'Cleveland Cavaliers', abbr: 'CLE', city: 'Cleveland', division: 'Central' },
    { conference: 'East', name: 'Miami Heat', abbr: 'MIA', city: 'Miami', division: 'Southeast' },
    { conference: 'West', name: 'Denver Nuggets', abbr: 'DEN', city: 'Denver', division: 'Northwest' },
    { conference: 'West', name: 'Phoenix Suns', abbr: 'PHX', city: 'Phoenix', division: 'Pacific' },
    { conference: 'West', name: 'Golden State Warriors', abbr: 'GSW', city: 'Golden State', division: 'Pacific' },
    { conference: 'West', name: 'Los Angeles Lakers', abbr: 'LAL', city: 'Los Angeles', division: 'Pacific' },
    { conference: 'West', name: 'Dallas Mavericks', abbr: 'DAL', city: 'Dallas', division: 'Southwest' },
  ];

  return teams.map((t, idx) => {
    const wins = 45 - idx * 2;
    const losses = 37 + idx * 2;
    return {
      team: {
        id: idx + 1,
        abbreviation: t.abbr,
        city: t.city,
        conference: t.conference as 'East' | 'West',
        division: t.division,
        full_name: `${t.city} ${t.name}`,
        name: t.name,
      },
      wins,
      losses,
      win_pct: Number((wins / (wins + losses)).toFixed(3)),
      games_behind: idx * 2,
      streak: Math.random() > 0.5 ? `W${Math.ceil(Math.random() * 3)}` : `L${Math.ceil(Math.random() * 2)}`,
      home_record: `${Math.floor(wins * 0.6)}-${Math.floor(losses * 0.4)}`,
      away_record: `${Math.floor(wins * 0.4)}-${Math.floor(losses * 0.6)}`,
      conf_record: `${Math.floor(wins * 0.55)}-${Math.floor(losses * 0.45)}`,
    };
  });
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

  const season = (req.query.season as string) || '2024-25';

  try {
    const data = await fetchStatsNBA('leaguestandingsv3', {
      LeagueID: '00',
      Season: season,
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

    const formatted: StandingData[] = teams.map((t: any) => ({
      team: {
        id: t.TeamID,
        abbreviation: t.TeamSlug || t.TeamCity,
        city: t.TeamCity,
        conference: t.Conference as 'East' | 'West',
        division: t.Division,
        full_name: t.TeamName,
        name: t.TeamName.replace(t.TeamCity, '').trim(),
      },
      wins: t.WINS || t.W,
      losses: t.LOSSES || t.L,
      win_pct: t.WinPCT || t.WinPercentage,
      games_behind: t.PlayoffRank || 0,
      streak: t.strCurrentStreak || 'N/A',
      home_record: t.HOME || t.HomeRecord || 'N/A',
      away_record: t.ROAD || t.RoadRecord || 'N/A',
      conf_record: t.Conference || 'N/A',
    }));

    return res.status(200).json(formatted);
  } catch (error: any) {
    console.log('Using fallback standings data');
    return handleError(res, error, generateFallbackStandings());
  }
}
