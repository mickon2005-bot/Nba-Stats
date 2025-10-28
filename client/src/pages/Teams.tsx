import { useQuery } from "@tanstack/react-query";
import { type TeamStats } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConferenceTabs } from "@/components/ConferenceTabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Teams() {
  const { data: teamStats, isLoading } = useQuery<TeamStats[]>({
    queryKey: ["/api/teams/stats"],
  });

  const eastTeams = teamStats?.filter(t => t.team.conference === "East") || [];
  const westTeams = teamStats?.filter(t => t.team.conference === "West") || [];

  const TeamStatsTable = ({ teams }: { teams: TeamStats[] }) => (
    <Card>
      <CardHeader>
        <CardTitle>Team Statistics</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Team</TableHead>
                <TableHead className="text-center font-semibold">W-L</TableHead>
                <TableHead className="text-center font-semibold">PPG</TableHead>
                <TableHead className="text-center font-semibold">OPP PPG</TableHead>
                <TableHead className="text-center font-semibold">FG%</TableHead>
                <TableHead className="text-center font-semibold">3P%</TableHead>
                <TableHead className="text-center font-semibold">RPG</TableHead>
                <TableHead className="text-center font-semibold">APG</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams
                .sort((a, b) => b.wins - a.wins)
                .map(team => (
                  <TableRow key={team.team.id} className="hover-elevate" data-testid={`row-team-${team.team.abbreviation}`}>
                    <TableCell className="font-semibold">
                      {team.team.full_name}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {team.wins}-{team.losses}
                    </TableCell>
                    <TableCell className="text-center font-mono font-semibold">
                      {team.ppg.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {team.opp_ppg.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {(team.fg_pct * 100).toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {(team.fg3_pct * 100).toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {team.rpg.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {team.apg.toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2" data-testid="heading-teams">Team Statistics</h1>
        <p className="text-muted-foreground">Performance metrics and team comparisons</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <ConferenceTabs
          eastContent={<TeamStatsTable teams={eastTeams} />}
          westContent={<TeamStatsTable teams={westTeams} />}
          allContent={<TeamStatsTable teams={teamStats || []} />}
        />
      )}
    </div>
  );
}
