import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type SeasonStats, type ShotData } from "@shared/schema";
import { BasketballCourt } from "@/components/BasketballCourt";
import { PerformanceTrendChart } from "@/components/PerformanceTrendChart";
import { ShotDistributionChart } from "@/components/ShotDistributionChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { StatCard } from "@/components/StatCard";

export default function PlayerDetail() {
  const [, params] = useRoute("/player/:id");
  const [, setLocation] = useLocation();
  const playerId = params?.id;

  const { data: playerStats, isLoading } = useQuery<SeasonStats>({
    queryKey: ["/api/players", playerId, "stats"],
    enabled: !!playerId,
  });

  const { data: shotData } = useQuery<ShotData[]>({
    queryKey: ["/api/players", playerId, "shots"],
    enabled: !!playerId,
  });

  const trendData = [
    { game: "Game 1", pts: 24, reb: 8, ast: 5 },
    { game: "Game 2", pts: 28, reb: 7, ast: 6 },
    { game: "Game 3", pts: 22, reb: 9, ast: 4 },
    { game: "Game 4", pts: 31, reb: 6, ast: 7 },
    { game: "Game 5", pts: 26, reb: 8, ast: 5 },
    { game: "Game 6", pts: 29, reb: 7, ast: 8 },
    { game: "Game 7", pts: 25, reb: 10, ast: 6 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!playerStats) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Player not found</p>
      </div>
    );
  }

  const player = playerStats.player;
  const twoPointMade = Math.floor((playerStats.fg_pct * 100) * 0.6);
  const twoPointMissed = 60 - twoPointMade;
  const threePointMade = Math.floor((playerStats.fg3_pct * 100) * 0.3);
  const threePointMissed = 30 - threePointMade;
  const freeThrowMade = Math.floor((playerStats.ft_pct * 100) * 0.2);
  const freeThrowMissed = 20 - freeThrowMade;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/players")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-4xl font-bold" data-testid="heading-player-name">
            {player.first_name} {player.last_name}
          </h1>
          <p className="text-muted-foreground">
            {player.team.full_name} • {player.position} • #{player.jersey_number}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="PPG" value={playerStats.pts.toFixed(1)} testId="stat-ppg" />
        <StatCard label="RPG" value={playerStats.reb.toFixed(1)} testId="stat-rpg" />
        <StatCard label="APG" value={playerStats.ast.toFixed(1)} testId="stat-apg" />
        <StatCard label="FG%" value={(playerStats.fg_pct * 100).toFixed(1)} suffix="%" testId="stat-fg" />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="shotchart" data-testid="tab-shotchart">Shot Chart</TabsTrigger>
          <TabsTrigger value="trends" data-testid="tab-trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Season Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Games Played</span>
                  <span className="font-mono font-semibold">{playerStats.games_played}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minutes Per Game</span>
                  <span className="font-mono font-semibold">{playerStats.min.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Steals</span>
                  <span className="font-mono font-semibold">{playerStats.stl.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blocks</span>
                  <span className="font-mono font-semibold">{playerStats.blk.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Turnovers</span>
                  <span className="font-mono font-semibold">{playerStats.turnover.toFixed(1)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shot Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ShotDistributionChart
                  twoPointMade={twoPointMade}
                  twoPointMissed={twoPointMissed}
                  threePointMade={threePointMade}
                  threePointMissed={threePointMissed}
                  freeThrowMade={freeThrowMade}
                  freeThrowMissed={freeThrowMissed}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shotchart" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Shot Chart - Season</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <BasketballCourt shots={shotData || []} />
              <div className="mt-4 flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-success" />
                  <span>Made</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-destructive" />
                  <span>Missed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Last 7 Games Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceTrendChart data={trendData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
