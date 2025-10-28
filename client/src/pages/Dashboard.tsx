import { useQuery } from "@tanstack/react-query";
import { type Game, type Standing } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, TrendingUp, Users, Award, ChevronRight, Clock, Play, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: games, isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ["/api/games/today"],
    retry: 1,
  });

  const { data: standings, isLoading: standingsLoading } = useQuery<Standing[]>({
    queryKey: ["/api/standings"],
    retry: 1,
  });

  const eastStandings = standings?.filter(s => s.team.conference === "East").slice(0, 5) || [];
  const westStandings = standings?.filter(s => s.team.conference === "West").slice(0, 5) || [];

  const liveGames = games?.filter(g => g.status === "live" || g.status === "in_progress") || [];
  const upcomingGames = games?.filter(g => g.status !== "live" && g.status !== "in_progress" && g.status !== "final" && g.status !== "Final") || [];
  const completedGames = games?.filter(g => g.status === "final" || g.status === "Final") || [];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-10 md:p-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
              <span className="text-white text-sm font-semibold uppercase tracking-wider">Live Tracker</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight" data-testid="heading-dashboard">
            NBA Stats <span className="text-white/80">2024-25</span>
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl">
            Real-time scores, comprehensive standings, and in-depth player statistics for the current season
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Total Games", value: games?.length || 0, icon: Trophy },
              { label: "Live Now", value: liveGames.length, icon: Play },
              { label: "Teams", value: "30", icon: Award },
              { label: "Active Players", value: "450+", icon: Users },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4 text-white/70" />
                  <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className="text-3xl font-bold text-white font-mono">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live & Upcoming Games */}
      {(liveGames.length > 0 || upcomingGames.length > 0 || completedGames.length > 0) && (
        <section className="space-y-6">
          {liveGames.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
                  <h2 className="text-3xl font-bold">Live Now</h2>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {liveGames.map(game => (
                  <GameCard 
                    key={game.id} 
                    game={game}
                    onClick={() => setLocation(`/game/${game.id}`)}
                    status="live"
                  />
                ))}
              </div>
            </div>
          )}

          {upcomingGames.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-7 h-7 text-accent" />
                <h2 className="text-3xl font-bold">Upcoming</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingGames.map(game => (
                  <GameCard 
                    key={game.id} 
                    game={game}
                    onClick={() => setLocation(`/game/${game.id}`)}
                    status="upcoming"
                  />
                ))}
              </div>
            </div>
          )}

          {completedGames.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-7 h-7 text-success-green" />
                <h2 className="text-3xl font-bold">Final Scores</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedGames.map(game => (
                  <GameCard 
                    key={game.id} 
                    game={game}
                    onClick={() => setLocation(`/game/${game.id}`)}
                    status="final"
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {gamesLoading && (
        <section>
          <h2 className="text-3xl font-bold mb-4">Today's Games</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        </section>
      )}

      {/* Standings */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">Conference Standings</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Eastern Conference */}
          <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-border/50">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">E</span>
                </div>
                Eastern Conference
              </h3>
            </div>
            
            {standingsLoading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="p-4">
                {eastStandings.map((standing, idx) => (
                  <StandingRow key={standing.team.id} standing={standing} rank={idx + 1} />
                ))}
              </div>
            )}
          </div>

          {/* Western Conference */}
          <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
            <div className="bg-gradient-to-r from-accent/10 to-primary/10 px-6 py-4 border-b border-border/50">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <span className="text-accent font-bold">W</span>
                </div>
                Western Conference
              </h3>
            </div>
            
            {standingsLoading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="p-4">
                {westStandings.map((standing, idx) => (
                  <StandingRow key={standing.team.id} standing={standing} rank={idx + 1} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setLocation("/teams")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover-elevate transition-all"
            data-testid="button-view-all-standings"
          >
            View Full Standings
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

function GameCard({ game, onClick, status }: { game: Game; onClick: () => void; status: "live" | "upcoming" | "final" }) {
  const winningTeam = game.home_team_score > game.visitor_team_score ? "home" : "visitor";
  
  return (
    <div
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all hover-elevate
        ${status === "live" ? "bg-gradient-to-br from-destructive/10 to-destructive/5 border-2 border-destructive/30" : "bg-card border border-border/50"}
      `}
      data-testid={`card-game-${game.id}`}
    >
      {status === "live" && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/20 backdrop-blur-sm border border-destructive/30">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            <span className="text-destructive text-xs font-bold uppercase tracking-wider">Live</span>
          </div>
        </div>
      )}

      {status === "upcoming" && game.time && (
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1 rounded-full bg-accent/20 border border-accent/30">
            <span className="text-accent text-xs font-semibold">{game.time}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Away Team */}
        <div className={`flex items-center justify-between ${status === "final" && winningTeam === "visitor" ? "opacity-100" : status === "final" ? "opacity-50" : ""}`}>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
              <span className="text-xl font-bold">{game.visitor_team.abbreviation}</span>
            </div>
            <div>
              <div className="font-bold text-lg">{game.visitor_team.name}</div>
              <div className="text-xs text-muted-foreground">{game.visitor_team.city}</div>
            </div>
          </div>
          <div className={`text-4xl font-bold font-mono ${status === "final" && winningTeam === "visitor" ? "text-success-green" : ""}`}>
            {game.visitor_team_score || 0}
          </div>
        </div>

        {/* Home Team */}
        <div className={`flex items-center justify-between ${status === "final" && winningTeam === "home" ? "opacity-100" : status === "final" ? "opacity-50" : ""}`}>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
              <span className="text-xl font-bold">{game.home_team.abbreviation}</span>
            </div>
            <div>
              <div className="font-bold text-lg">{game.home_team.name}</div>
              <div className="text-xs text-muted-foreground">{game.home_team.city}</div>
            </div>
          </div>
          <div className={`text-4xl font-bold font-mono ${status === "final" && winningTeam === "home" ? "text-success-green" : ""}`}>
            {game.home_team_score || 0}
          </div>
        </div>
      </div>

      {status === "final" && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-semibold">Final</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StandingRow({ standing, rank }: { standing: Standing; rank: number }) {
  const winPct = (standing.win_pct * 100).toFixed(1);
  
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover-elevate transition-all" data-testid={`row-standing-${standing.team.abbreviation}`}>
      <div className={`
        w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
        ${rank === 1 ? "bg-gradient-to-br from-primary to-secondary text-white" : "bg-muted/50 text-muted-foreground"}
      `}>
        {rank}
      </div>
      
      <div className="flex-1">
        <div className="font-bold text-base">{standing.team.full_name}</div>
        <div className="text-xs text-muted-foreground">{standing.team.division}</div>
      </div>

      <div className="text-right">
        <div className="font-bold font-mono text-lg">{standing.wins}-{standing.losses}</div>
        <div className="text-xs text-muted-foreground">{winPct}%</div>
      </div>

      <div className={`
        px-2 py-1 rounded-md text-xs font-semibold
        ${standing.streak.startsWith('W') ? "bg-success-green/20 text-success-green" : "bg-destructive/20 text-destructive"}
      `}>
        {standing.streak}
      </div>
    </div>
  );
}
