import { useState, useMemo } from "react";
import { type SeasonStats } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";

interface PlayerStatsTableProps {
  stats: SeasonStats[];
  title?: string;
}

type SortKey = keyof Omit<SeasonStats, 'player'>;
type SortDirection = 'asc' | 'desc';

export function PlayerStatsTable({ stats, title = "Player Statistics" }: PlayerStatsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('pts');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedStats = useMemo(() => {
    let filtered = stats;
    
    if (searchQuery) {
      filtered = stats.filter(stat => 
        `${stat.player.first_name} ${stat.player.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        stat.player.team.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return [...filtered].sort((a, b) => {
      const aValue = a[sortKey] as number;
      const bValue = b[sortKey] as number;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [stats, sortKey, sortDirection, searchQuery]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-3 h-3 ml-1" />
      : <ArrowDown className="w-3 h-3 ml-1" />;
  };

  return (
    <Card data-testid="card-player-stats">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search players or teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-players"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold sticky left-0 bg-muted/50 z-10">Player</TableHead>
                <TableHead className="font-semibold">Team</TableHead>
                <TableHead className="text-center font-semibold w-16">GP</TableHead>
                <TableHead className="text-center font-semibold w-20">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort('min')}
                  >
                    MIN
                    <SortIcon column="min" />
                  </Button>
                </TableHead>
                <TableHead className="text-center font-semibold w-20">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort('pts')}
                    data-testid="button-sort-pts"
                  >
                    PTS
                    <SortIcon column="pts" />
                  </Button>
                </TableHead>
                <TableHead className="text-center font-semibold w-20">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort('reb')}
                  >
                    REB
                    <SortIcon column="reb" />
                  </Button>
                </TableHead>
                <TableHead className="text-center font-semibold w-20">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort('ast')}
                  >
                    AST
                    <SortIcon column="ast" />
                  </Button>
                </TableHead>
                <TableHead className="text-center font-semibold w-20">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort('fg_pct')}
                  >
                    FG%
                    <SortIcon column="fg_pct" />
                  </Button>
                </TableHead>
                <TableHead className="text-center font-semibold w-20">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort('fg3_pct')}
                  >
                    3P%
                    <SortIcon column="fg3_pct" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedStats.map((stat) => (
                <TableRow
                  key={stat.player.id}
                  className="hover-elevate"
                  data-testid={`row-player-${stat.player.id}`}
                >
                  <TableCell className="font-semibold sticky left-0 bg-card z-10">
                    {stat.player.first_name} {stat.player.last_name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {stat.player.team.abbreviation}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {stat.games_played}
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold">
                    {stat.min.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center font-mono font-bold text-primary">
                    {stat.pts.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold">
                    {stat.reb.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold">
                    {stat.ast.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {(stat.fg_pct * 100).toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {(stat.fg3_pct * 100).toFixed(1)}
                  </TableCell>
                </TableRow>
              ))}
              {filteredAndSortedStats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No players found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
