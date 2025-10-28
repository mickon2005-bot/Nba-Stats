import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  suffix?: string;
  testId?: string;
}

export function StatCard({ label, value, change, suffix = "", testId }: StatCardProps) {
  return (
    <Card data-testid={testId}>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
        <div className="flex items-end justify-between">
          <span className="text-4xl font-bold font-mono" data-testid={`${testId}-value`}>
            {value}{suffix}
          </span>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
