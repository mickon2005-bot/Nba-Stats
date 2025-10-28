import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { type TeamStats } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, TrendingUp, Target, Activity, Trophy } from "lucide-react";
import { SeasonSelector } from "@/components/SeasonSelector";
import { getCurrentSeason } from "@/lib/seasons";

export default function Teams() {
  const [selectedConference, setSelectedConference] = useState<"all" | "east" | "west">("all");
  
  // Initialize season from URL params, localStorage, or default
  const getInitialSeason = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSeason = urlParams.get('teamsSeason');
    if (urlSeason) return urlSeason;
    
    const storedSeason = localStorage.getItem('teamsSeason');
    if (storedSeason) return storedSeason;
    
    return getCurrentSeason();
  };
  
  const [selectedSeason, setSelectedSeason] = useState(getInitialSeason);
  
  // Sync URL and localStorage when season changes
  useEffect(() => {
    const newParams = new URLSearchParams(window.location.search);
    newParams.set('teamsSeason', selectedSeason);
    window.history.replaceState({}, '', `${window.location.pathname}?${newParams.toString()}`);
    localStorage.setItem('teamsSeason', selectedSeason);
  }, [selectedSeason]);

  const { data: teamStats, isLoading } = useQuery<TeamStats[]>({
    queryKey: ["/api/teams/stats", selectedSeason],
    queryFn: async () => {
      const response = await fetch(`/api/teams/stats?season=${selectedSeason}`);
      if (!response.ok) throw new Error('Failed to fetch team stats');
      return response.json();
    },
    retry: 1,
  });

  const eastTeams = teamStats?.filter(t => t.team.conference === "East").sort((a, b) => b.wins - a.wins) || [];
  const westTeams = teamStats?.filter(t => t.team.conference === "West").sort((a, b) => b.wins - a.wins) || [];
  const allTeams = teamStats?.sort((a, b) => b.wins - a.wins) || [];

  const displayTeams = selectedConference === "all" ? allTeams : selectedConference === "east" ? eastTeams : westTeams;

  const conferences = [
    { id: "all", label: "All Teams", count: allTeams.length },
    { id: "east", label: "Eastern", count: eastTeams.length },
    { id: "west", label: "Western", count: westTeams.length },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2" data-testid="heading-teams">
            Team Statistics
          </h1>
          <p className="text-muted-foreground text-lg">Performance metrics and team rankings</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <SeasonSelector value={selectedSeason} onChange={setSelectedSeason} />
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/50">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-mono font-bold text-2xl">30</span>
            <span className="text-sm text-muted-foreground">Teams</span>
          </div>
        </div>
      </div>

      {/* Conference Tabs */}
      <div className="grid grid-cols-3 gap-3">
        {conferences.map((conf) => {
          const isActive = selectedConference === conf.id;
          return (
            <button
              key={conf.id}
              onClick={() => setSelectedConference(conf.id as any)}
              className={`
                p-5 rounded-2xl transition-all cursor-pointer
                ${isActive 
                  ? "bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/25" 
                  : "bg-card border border-border/50 hover-elevate"
                }
              `}
              data-testid={`tab-${conf.id}`}
            >
              <div className={`text-3xl font-bold font-mono mb-1 ${isActive ? "text-white" : "text-primary"}`}>
                {conf.count}
              </div>
              <div className={`font-semibold text-sm ${isActive ? "text-white/90" : "text-foreground"}`}>
                {conf.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Points Per Game", icon: Trophy, key: "ppg" },
          { label: "Shooting %", icon: Target, key: "fg_pct" },
          { label: "Rebounds", icon: TrendingUp, key: "rpg" },
          { label: "Assists", icon: Activity, key: "apg" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-muted-foreground">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Teams Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {displayTeams?.map((team, idx) => (
            <TeamCard key={team.team.id} teamStats={team} rank={idx + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function TeamCard({ teamStats, rank }: { teamStats: TeamStats; rank: number }) {
  const { team, wins, losses, ppg, opp_ppg, fg_pct, fg3_pct, rpg, apg } = teamStats;
  const winPct = ((wins / (wins + losses)) * 100).toFixed(1);
  
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6 hover-elevate transition-all" data-testid={`card-team-${team.abbreviation}`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0
            ${rank <= 3 ? "bg-gradient-to-br from-primary to-secondary text-white" : "bg-muted/50 text-muted-foreground"}
          `}>
            {rank}
          </div>

          <div>
            <div className="font-bold text-2xl">{team.full_name}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-primary">{team.abbreviation}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{team.division}</span>
            </div>
          </div>
        </div>

        <div className={`
          px-3 py-1 rounded-lg text-xs font-semibold
          ${team.conference === "East" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}
        `}>
          {team.conference}
        </div>
      </div>

      {/* Record */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <div className="text-3xl font-bold font-mono text-success-green">{wins}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Wins</div>
        </div>
        <div>
          <div className="text-3xl font-bold font-mono text-destructive">{losses}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Losses</div>
        </div>
        <div>
          <div className="text-3xl font-bold font-mono text-primary">{winPct}%</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Win Rate</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-3 pt-6 border-t border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Points Per Game</span>
          </div>
          <span className="font-mono font-bold text-lg">{ppg.toFixed(1)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Opponent PPG</span>
          </div>
          <span className="font-mono font-semibold text-lg">{opp_ppg.toFixed(1)}</span>
        </div>

        <div className="grid grid-cols-4 gap-3 pt-3 border-t border-border/30">
          <div className="text-center">
            <div className="font-mono font-semibold">{(fg_pct * 100).toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">FG%</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-semibold">{(fg3_pct * 100).toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">3PT%</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-semibold">{rpg.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">RPG</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-semibold">{apg.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">APG</div>
          </div>
        </div>
      </div>
    </div>
  );
}
