import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ShotDistributionChartProps {
  twoPointMade: number;
  twoPointMissed: number;
  threePointMade: number;
  threePointMissed: number;
  freeThrowMade: number;
  freeThrowMissed: number;
}

export function ShotDistributionChart({
  twoPointMade,
  twoPointMissed,
  threePointMade,
  threePointMissed,
  freeThrowMade,
  freeThrowMissed,
}: ShotDistributionChartProps) {
  const data = [
    { name: "2PT Made", value: twoPointMade, color: "hsl(142, 76%, 36%)" },
    { name: "2PT Missed", value: twoPointMissed, color: "hsl(142, 76%, 36%, 0.3)" },
    { name: "3PT Made", value: threePointMade, color: "hsl(221, 83%, 53%)" },
    { name: "3PT Missed", value: threePointMissed, color: "hsl(221, 83%, 53%, 0.3)" },
    { name: "FT Made", value: freeThrowMade, color: "hsl(48, 96%, 53%)" },
    { name: "FT Missed", value: freeThrowMissed, color: "hsl(48, 96%, 53%, 0.3)" },
  ].filter(item => item.value > 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
