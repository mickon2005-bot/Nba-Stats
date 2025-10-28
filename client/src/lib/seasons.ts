// Generate available NBA seasons from 2018-19 to 2024-25
export function getAvailableSeasons(): string[] {
  const seasons: string[] = [];
  
  // Generate seasons from 2018-19 to 2024-25
  for (let year = 2018; year <= 2024; year++) {
    const nextYear = (year + 1).toString().slice(-2);
    seasons.push(`${year}-${nextYear}`);
  }
  
  return seasons.reverse(); // Most recent first (2024-25, 2023-24, ...)
}

export function getCurrentSeason(): string {
  return '2024-25'; // Current NBA season
}

export function formatSeasonDisplay(season: string): string {
  const [startYear, endYear] = season.split('-');
  return `${startYear}-${endYear}`;
}
