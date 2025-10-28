import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TrendDataPoint {
  game: string;
  pts: number;
  reb?: number;
  ast?: number;
}

interface PerformanceTrendChartProps {
  data: TrendDataPoint[];
  showRebounds?: boolean;
  showAssists?: boolean;
}

export function PerformanceTrendChart({ 
  data, 
  showRebounds = true, 
  showAssists = true 
}: PerformanceTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis 
          dataKey="game" 
          className="text-xs"
          tick={{ fill: 'hsl(var(--foreground))' }}
        />
        <YAxis 
          className="text-xs"
          tick={{ fill: 'hsl(var(--foreground))' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.375rem',
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="pts" 
          stroke="hsl(var(--chart-1))" 
          strokeWidth={2}
          name="Points"
          dot={{ r: 4 }}
        />
        {showRebounds && (
          <Line 
            type="monotone" 
            dataKey="reb" 
            stroke="hsl(var(--chart-3))" 
            strokeWidth={2}
            name="Rebounds"
            dot={{ r: 4 }}
          />
        )}
        {showAssists && (
          <Line 
            type="monotone" 
            dataKey="ast" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth={2}
            name="Assists"
            dot={{ r: 4 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
