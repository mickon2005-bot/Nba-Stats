import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { getAvailableSeasons } from "@/lib/seasons";

interface SeasonSelectorProps {
  value: string;
  onChange: (season: string) => void;
}

export function SeasonSelector({ value, onChange }: SeasonSelectorProps) {
  const seasons = getAvailableSeasons();

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card border border-border/50">
      <Calendar className="w-5 h-5 text-primary" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[140px] border-0 bg-transparent focus:ring-0 font-semibold" data-testid="select-season">
          <SelectValue placeholder="Select season" />
        </SelectTrigger>
        <SelectContent>
          {seasons.map((season) => (
            <SelectItem key={season} value={season} data-testid={`season-${season}`}>
              {season}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
