import { useQuery } from "@tanstack/react-query";
import { type SeasonStats } from "@shared/schema";
import { PlayerStatsTable } from "@/components/PlayerStatsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Players() {
  const { data: stats, isLoading } = useQuery<SeasonStats[]>({
    queryKey: ["/api/players/stats"],
  });

  const topScorers = stats?.slice(0, 50) || [];
  const topRebounders = stats
    ?.sort((a, b) => b.reb - a.reb)
    .slice(0, 50) || [];
  const topAssists = stats
    ?.sort((a, b) => b.ast - a.ast)
    .slice(0, 50) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2" data-testid="heading-players">Player Statistics</h1>
        <p className="text-muted-foreground">Season averages and performance metrics</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all" data-testid="tab-all-players">All Players</TabsTrigger>
            <TabsTrigger value="scorers">Top Scorers</TabsTrigger>
            <TabsTrigger value="rebounders">Top Rebounders</TabsTrigger>
            <TabsTrigger value="assists">Top Assists</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <PlayerStatsTable stats={stats || []} title="All Players" />
          </TabsContent>

          <TabsContent value="scorers" className="mt-6">
            <PlayerStatsTable stats={topScorers} title="Top 50 Scorers" />
          </TabsContent>

          <TabsContent value="rebounders" className="mt-6">
            <PlayerStatsTable stats={topRebounders} title="Top 50 Rebounders" />
          </TabsContent>

          <TabsContent value="assists" className="mt-6">
            <PlayerStatsTable stats={topAssists} title="Top 50 Assists Leaders" />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
