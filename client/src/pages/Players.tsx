import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type SeasonStats } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Trophy, Target, TrendingUp, Search, Filter, Award } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Players() {
  const { data: stats, isLoading } = useQuery<SeasonStats[]>({
    queryKey: ["/api/players/stats"],
    retry: 1,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "scorers" | "rebounders" | "assists">("all");

  const filteredStats = stats?.filter(stat => {
    const playerName = `${stat.player.first_name} ${stat.player.last_name}`.toLowerCase();
    const teamName = stat.player.team?.abbreviation?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return playerName.includes(query) || teamName.includes(query);
  });

  const displayStats = selectedCategory === "all" ? filteredStats :
    selectedCategory === "scorers" ? filteredStats?.sort((a, b) => b.pts - a.pts).slice(0, 20) :
    selectedCategory === "rebounders" ? filteredStats?.sort((a, b) => b.reb - a.reb).slice(0, 20) :
    filteredStats?.sort((a, b) => b.ast - a.ast).slice(0, 20);

  const categories = [
    { id: "all", label: "All Players", icon: Users },
    { id: "scorers", label: "Top Scorers", icon: Trophy },
    { id: "rebounders", label: "Top Rebounders", icon: Target },
    { id: "assists", label: "Top Assists", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2" data-testid="heading-players">
            Player Statistics
          </h1>
          <p className="text-muted-foreground text-lg">Season averages and performance leaders</p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/50">
          <Users className="w-5 h-5 text-primary" />
          <span className="font-mono font-bold text-2xl">{stats?.length || 0}</span>
          <span className="text-sm text-muted-foreground">Players</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search players by name or team..."
            className="pl-12 h-14 rounded-xl bg-card border-border/50 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-players"
          />
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/50">
          <Filter className="w-5 h-5 text-accent" />
          <span className="text-sm font-semibold text-muted-foreground">Category</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`
                p-5 rounded-2xl transition-all cursor-pointer
                ${isActive 
                  ? "bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/25" 
                  : "bg-card border border-border/50 hover-elevate"
                }
              `}
              data-testid={`tab-${cat.id}`}
            >
              <Icon className={`w-6 h-6 mb-2 ${isActive ? "text-white" : "text-primary"}`} />
              <div className={`font-semibold text-sm ${isActive ? "text-white" : "text-foreground"}`}>
                {cat.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Players Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayStats?.map((stat, idx) => (
            <PlayerCard key={stat.player.id} stat={stat} rank={idx + 1} category={selectedCategory} />
          ))}
        </div>
      )}

      {!isLoading && displayStats?.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No players found matching your search.</p>
        </div>
      )}
    </div>
  );
}

function PlayerCard({ stat, rank, category }: { stat: SeasonStats; rank: number; category: string }) {
  const { player, pts, reb, ast, fg_pct, games_played } = stat;
  
  const highlightStat = category === "scorers" ? pts : category === "rebounders" ? reb : category === "assists" ? ast : pts;
  const highlightLabel = category === "scorers" ? "PPG" : category === "rebounders" ? "RPG" : category === "assists" ? "APG" : "PPG";

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6 hover-elevate transition-all" data-testid={`card-player-${player.id}`}>
      {rank <= 3 && category !== "all" && (
        <div className="absolute top-4 right-4">
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
            ${rank === 1 ? "bg-gradient-to-br from-primary to-secondary text-white" : 
              rank === 2 ? "bg-gradient-to-br from-muted to-muted-foreground/20 text-foreground" :
              "bg-gradient-to-br from-accent/20 to-accent/10 text-accent"}
          `}>
            {rank}
          </div>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-primary">{player.first_name?.[0]}{player.last_name?.[0]}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-bold text-xl truncate">
            {player.first_name} {player.last_name}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold text-primary">{player.team?.abbreviation || "N/A"}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{player.position || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border/30">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-3xl font-bold font-mono text-primary">{highlightStat.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{highlightLabel}</div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-mono font-semibold">{(fg_pct * 100).toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">FG%</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center">
            <div className="font-mono font-semibold">{pts.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">PTS</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-semibold">{reb.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">REB</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-semibold">{ast.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">AST</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>{games_played} Games Played</span>
          {rank <= 10 && category !== "all" && (
            <div className="flex items-center gap-1 text-primary">
              <Award className="w-3 h-3" />
              <span className="font-semibold">Top 10</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
