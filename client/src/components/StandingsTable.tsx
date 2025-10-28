import { type Standing } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StandingsTableProps {
  standings: Standing[];
  conference: "East" | "West";
}

export function StandingsTable({ standings, conference }: StandingsTableProps) {
  const sortedStandings = [...standings].sort((a, b) => b.win_pct - a.win_pct);

  return (
    <Card data-testid={`card-standings-${conference.toLowerCase()}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">{conference}ern Conference</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center font-semibold">#</TableHead>
                <TableHead className="font-semibold">Team</TableHead>
                <TableHead className="text-center font-semibold w-16">W</TableHead>
                <TableHead className="text-center font-semibold w-16">L</TableHead>
                <TableHead className="text-center font-semibold w-20">PCT</TableHead>
                <TableHead className="text-center font-semibold w-16">GB</TableHead>
                <TableHead className="text-center font-semibold w-24">STRK</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStandings.map((standing, index) => (
                <TableRow
                  key={standing.team.id}
                  className="hover-elevate"
                  data-testid={`row-team-${standing.team.abbreviation}`}
                >
                  <TableCell className="text-center font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-2">
                      <span data-testid={`text-team-${standing.team.abbreviation}`}>
                        {standing.team.full_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold" data-testid={`text-wins-${standing.team.abbreviation}`}>
                    {standing.wins}
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold" data-testid={`text-losses-${standing.team.abbreviation}`}>
                    {standing.losses}
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold">
                    {standing.win_pct.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-center font-mono text-muted-foreground">
                    {standing.games_behind === 0 ? "—" : standing.games_behind.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm">
                    <span className={standing.streak.startsWith("W") ? "text-success" : "text-destructive"}>
                      {standing.streak}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
