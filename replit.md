# NBA Stats Tracker

A comprehensive real-time NBA statistics tracker featuring live game scores, player statistics, team standings, and interactive visualizations including shot charts and animated play-by-play replays.

## Features

### Core Features
- **Live Game Scores**: Real-time updates for ongoing NBA games with quarter-by-quarter scores
- **Conference Standings**: Separate East and West conference standings with win/loss records, percentages, and streaks
- **Player Statistics**: Comprehensive player stats including points, rebounds, assists, shooting percentages
- **Team Statistics**: Team performance metrics with PPG, defensive stats, and shooting percentages
- **Interactive Shot Charts**: Basketball court visualization showing shot locations and efficiency
- **Animated Play-by-Play**: Court view with moving player dots showing game plays
- **Sortable Tables**: Click to sort players by any statistical category
- **Search Functionality**: Search players and teams across all stat tables

### Interactive Visualizations
- **Shot Chart Heatmap**: Color-coded zones showing shooting efficiency
- **Court Animations**: Play-by-play visualization with controllable timeline
- **Performance Trends**: Line charts showing player performance over time
- **Shot Distribution**: Pie charts breaking down 2PT, 3PT, and FT attempts

## Technology Stack

### Frontend
- **React** with TypeScript for type-safe UI components
- **Wouter** for lightweight client-side routing
- **TanStack Query** for efficient data fetching and caching
- **Tailwind CSS** for styling with custom NBA-themed design system
- **Shadcn UI** for accessible, customizable component library
- **Recharts** for data visualization and charts
- **Framer Motion** for smooth animations

### Backend
- **Express.js** for API server
- **Node-cache** for response caching to improve performance
- **BallDontLie API** as the data source for NBA statistics
- **Zod** for runtime type validation

## API Endpoints

- `GET /api/games/today` - Get today's NBA games
- `GET /api/games/:id` - Get specific game details
- `GET /api/games/:id/plays` - Get play-by-play data for a game
- `GET /api/games/:id/shots/:team` - Get shot chart data
- `GET /api/standings` - Get league standings by conference
- `GET /api/players/stats` - Get player season statistics
- `GET /api/teams/stats` - Get team statistics

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn UI components
│   │   │   ├── BasketballCourt.tsx
│   │   │   ├── PlayByPlayCourt.tsx
│   │   │   ├── StandingsTable.tsx
│   │   │   ├── PlayerStatsTable.tsx
│   │   │   ├── LiveGameCard.tsx
│   │   │   ├── ShotDistributionChart.tsx
│   │   │   ├── PerformanceTrendChart.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── ConferenceTabs.tsx
│   │   │   └── Layout.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Players.tsx
│   │   │   ├── Teams.tsx
│   │   │   └── GameDetails.tsx
│   │   └── App.tsx
│   └── index.html
├── server/
│   ├── routes.ts         # API route handlers
│   ├── nba-api.ts        # BallDontLie API integration
│   └── storage.ts        # Caching layer
└── shared/
    └── schema.ts         # TypeScript types and Zod schemas
```

## Design System

The application uses a custom NBA-themed design system with:
- **Primary Blue**: Used for key actions and highlights
- **NBA Orange**: Accent color for live indicators and special elements
- **Court Colors**: Wood texture for basketball court visualizations
- **Success Green**: For positive indicators (wins, made shots)
- **Destructive Red**: For negative indicators (losses, missed shots)

The design follows sports-focused patterns with:
- Clean, data-dense layouts for statistical information
- Monospaced fonts for numerical data alignment
- High contrast for readability
- Responsive design for mobile, tablet, and desktop

## Data Caching Strategy

- **Live Games**: 60-second cache
- **Player/Team Stats**: 5-minute cache
- **Standings**: 5-minute cache
- **Team Lists**: 1-hour cache

## Current Season

The application tracks the **2024-25 NBA season**.

## External Dependencies

- **BallDontLie API**: Free NBA statistics API (https://www.balldontlie.io/)
  - No API key required for basic usage
  - Rate limits apply based on usage tier
  
## Development Notes

- The play-by-play animation uses simulated player positions since detailed positional data requires premium API access
- Shot chart data is generated based on typical NBA shooting patterns for demonstration purposes
- All team/player data comes from the live BallDontLie API
- The application implements automatic dark/light theme switching based on user preference

## Future Enhancements

- Historical season data and comparisons
- Advanced player comparison tools
- Playoff bracket visualization
- Real-time notifications for game events
- Customizable dashboard widgets
- Data export functionality
