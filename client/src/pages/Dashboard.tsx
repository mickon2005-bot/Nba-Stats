import { useQuery } from "@tanstack/react-query";
import { type Game, type Standing } from "@shared/schema";
import { LiveGameCard } from "@/components/LiveGameCard";
import { StandingsTable } from "@/components/StandingsTable";
import { ConferenceTabs } from "@/components/ConferenceTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: games, isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ["/api/games/today"],
  });

  const { data: standings, isLoading: standingsLoading } = useQuery<Standing[]>({
    queryKey: ["/api/standings"],
  });

  const eastStandings = standings?.filter(s => s.team.conference === "East") || [];
  const westStandings = standings?.filter(s => s.team.conference === "West") || [];

  const liveGames = games?.filter(g => g.status === "live" || g.status === "in_progress") || [];
  const upcomingGames = games?.filter(g => g.status !== "live" && g.status !== "in_progress" && g.status !== "final") || [];
  const completedGames = games?.filter(g => g.status === "final" || g.status === "Final") || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2" data-testid="heading-dashboard">NBA Live</h1>
        <p className="text-muted-foreground">Real-time scores, standings, and statistics</p>
      </div>

      {(liveGames.length > 0 || upcomingGames.length > 0 || completedGames.length > 0) && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Today's Games</h2>
          
          {liveGames.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-destructive">Live Now</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {liveGames.map(game => (
                  <LiveGameCard 
                    key={game.id} 
                    game={game}
                    onClick={() => setLocation(`/game/${game.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {upcomingGames.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Upcoming</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingGames.map(game => (
                  <LiveGameCard 
                    key={game.id} 
                    game={game}
                    onClick={() => setLocation(`/game/${game.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {completedGames.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Final</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedGames.map(game => (
                  <LiveGameCard 
                    key={game.id} 
                    game={game}
                    onClick={() => setLocation(`/game/${game.id}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {gamesLoading && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Today's Games</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold mb-4">Standings</h2>
        {standingsLoading ? (
          <Skeleton className="h-96" />
        ) : (
          <ConferenceTabs
            eastContent={<StandingsTable standings={eastStandings} conference="East" />}
            westContent={<StandingsTable standings={westStandings} conference="West" />}
          />
        )}
      </section>
    </div>
  );
}
