import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type Game, type PlayEvent, type ShotData } from "@shared/schema";
import { PlayByPlayCourt } from "@/components/PlayByPlayCourt";
import { BasketballCourt } from "@/components/BasketballCourt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function GameDetails() {
  const [, params] = useRoute("/game/:id");
  const [, setLocation] = useLocation();
  const gameId = params?.id;

  const { data: game, isLoading: gameLoading } = useQuery<Game>({
    queryKey: ["/api/games", gameId],
    enabled: !!gameId,
  });

  const { data: plays, isLoading: playsLoading } = useQuery<PlayEvent[]>({
    queryKey: ["/api/games", gameId, "plays"],
    enabled: !!gameId,
  });

  const { data: homeShots, isLoading: homeShotsLoading } = useQuery<ShotData[]>({
    queryKey: ["/api/games", gameId, "shots", "home"],
    enabled: !!gameId,
  });

  const { data: awayShots, isLoading: awayShotsLoading } = useQuery<ShotData[]>({
    queryKey: ["/api/games", gameId, "shots", "away"],
    enabled: !!gameId,
  });

  if (gameLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Game not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-game-details">
            {game.visitor_team.full_name} @ {game.home_team.full_name}
          </h1>
          <p className="text-muted-foreground">
            {new Date(game.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="grid grid-cols-3 items-center gap-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{game.visitor_team.abbreviation}</h2>
              <p className="text-6xl font-bold font-mono" data-testid="text-away-final-score">
                {game.visitor_team_score}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                {game.status === "final" || game.status === "Final" ? "FINAL" : "LIVE"}
              </p>
              {game.period && (
                <p className="text-lg font-semibold">
                  Q{game.period} {game.time}
                </p>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{game.home_team.abbreviation}</h2>
              <p className="text-6xl font-bold font-mono" data-testid="text-home-final-score">
                {game.home_team_score}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="playbyplay" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="playbyplay" data-testid="tab-playbyplay">Play-by-Play</TabsTrigger>
          <TabsTrigger value="shotcharts" data-testid="tab-shotcharts">Shot Charts</TabsTrigger>
          <TabsTrigger value="boxscore" data-testid="tab-boxscore">Box Score</TabsTrigger>
        </TabsList>

        <TabsContent value="playbyplay" className="mt-6">
          {playsLoading ? (
            <Skeleton className="h-96" />
          ) : (
            <PlayByPlayCourt plays={plays || []} />
          )}
        </TabsContent>

        <TabsContent value="shotcharts" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{game.away_team.full_name} Shot Chart</CardTitle>
              </CardHeader>
              <CardContent>
                {awayShotsLoading ? (
                  <Skeleton className="h-96" />
                ) : (
                  <div className="space-y-4">
                    <BasketballCourt shots={awayShots || []} />
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Made: {awayShots?.filter(s => s.made).length || 0} / Missed: {awayShots?.filter(s => !s.made).length || 0}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{game.home_team.full_name} Shot Chart</CardTitle>
              </CardHeader>
              <CardContent>
                {homeShotsLoading ? (
                  <Skeleton className="h-96" />
                ) : (
                  <div className="space-y-4">
                    <BasketballCourt shots={homeShots || []} />
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Made: {homeShots?.filter(s => s.made).length || 0} / Missed: {homeShots?.filter(s => !s.made).length || 0}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="boxscore" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>Box score data coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
