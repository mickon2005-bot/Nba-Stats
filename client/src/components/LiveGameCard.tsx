import { type Game } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LiveGameCardProps {
  game: Game;
  onClick?: () => void;
}

export function LiveGameCard({ game, onClick }: LiveGameCardProps) {
  const isLive = game.status === "live" || game.status === "in_progress";
  const isFinal = game.status === "final" || game.status === "Final";

  return (
    <Card
      className="p-4 hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid={`card-game-${game.id}`}
    >
      <div className="flex items-center justify-between mb-3">
        {isLive && (
          <Badge variant="destructive" className="gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            LIVE
          </Badge>
        )}
        {isFinal && (
          <Badge variant="secondary">FINAL</Badge>
        )}
        {!isLive && !isFinal && (
          <Badge variant="outline">{new Date(game.date).toLocaleDateString()}</Badge>
        )}
        {game.period && (
          <span className="text-xs font-medium text-muted-foreground ml-auto">
            Q{game.period} {game.time}
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-sm font-semibold w-12" data-testid={`text-away-team-${game.id}`}>
              {game.visitor_team.abbreviation}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {game.visitor_team.city}
            </span>
          </div>
          <span
            className="text-2xl font-bold font-mono ml-4"
            data-testid={`text-away-score-${game.id}`}
          >
            {game.visitor_team_score}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-sm font-semibold w-12" data-testid={`text-home-team-${game.id}`}>
              {game.home_team.abbreviation}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {game.home_team.city}
            </span>
          </div>
          <span
            className="text-2xl font-bold font-mono ml-4"
            data-testid={`text-home-score-${game.id}`}
          >
            {game.home_team_score}
          </span>
        </div>
      </div>
    </Card>
  );
}
