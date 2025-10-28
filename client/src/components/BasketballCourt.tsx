import { type ShotData } from "@shared/schema";

interface BasketballCourtProps {
  shots?: ShotData[];
  showHeatmap?: boolean;
  className?: string;
}

export function BasketballCourt({ shots = [], showHeatmap = false, className = "" }: BasketballCourtProps) {
  const courtWidth = 600;
  const courtHeight = 550;
  
  // NBA court dimensions (in feet): 50 wide x 47 long (half court)
  const scaleX = courtWidth / 50;
  const scaleY = courtHeight / 47;

  const getHeatmapColor = (x: number, y: number): string => {
    if (!showHeatmap || shots.length === 0) return "transparent";
    
    const radius = 3;
    const shotsNearby = shots.filter(shot => {
      const dx = shot.x - x;
      const dy = shot.y - y;
      return Math.sqrt(dx * dx + dy * dy) < radius;
    });
    
    if (shotsNearby.length === 0) return "transparent";
    
    const made = shotsNearby.filter(s => s.made).length;
    const percentage = made / shotsNearby.length;
    
    if (percentage >= 0.5) return `rgba(34, 197, 94, ${0.2 + percentage * 0.4})`;
    return `rgba(239, 68, 68, ${0.2 + (1 - percentage) * 0.4})`;
  };

  return (
    <svg
      viewBox={`0 0 ${courtWidth} ${courtHeight}`}
      className={`w-full ${className}`}
      style={{ maxWidth: '600px' }}
    >
      <defs>
        <pattern id="wood-texture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" className="fill-court-wood/10" />
        </pattern>
      </defs>
      
      <rect width={courtWidth} height={courtHeight} className="fill-court-wood" />
      <rect width={courtWidth} height={courtHeight} fill="url(#wood-texture)" />
      
      <g className="stroke-court-lines" strokeWidth="2" fill="none">
        <rect x="10" y="10" width={courtWidth - 20} height={courtHeight - 20} />
        
        <line x1="10" y1={courtHeight / 2} x2={courtWidth - 10} y2={courtHeight / 2} />
        
        <circle cx={courtWidth / 2} cy={courtHeight / 2} r="60" />
        <circle cx={courtWidth / 2} cy={courtHeight / 2} r="20" className="fill-court-wood" />
        
        <rect x="10" y={courtHeight - 200} width="160" height="190" />
        
        <path d={`M 90 ${courtHeight - 200} A 60 60 0 0 1 90 ${courtHeight - 10}`} />
        
        <rect x="10" y={courtHeight - 10} width="70" height="10" className="fill-court-lines" />
        
        <path
          d={`M ${courtWidth / 2} ${courtHeight - 10} A 237.5 237.5 0 0 1 ${courtWidth / 2 - 220} ${courtHeight - 10}`}
          className="stroke-nba-orange"
          strokeWidth="3"
        />
      </g>
      
      {showHeatmap && (
        <g opacity="0.6">
          {Array.from({ length: 20 }, (_, i) => i).map(i =>
            Array.from({ length: 20 }, (_, j) => j).map(j => {
              const x = (i + 0.5) * 2.5;
              const y = (j + 0.5) * 2.35;
              const color = getHeatmapColor(x, y);
              return color !== "transparent" ? (
                <rect
                  key={`heat-${i}-${j}`}
                  x={x * scaleX}
                  y={y * scaleY}
                  width={2.5 * scaleX}
                  height={2.35 * scaleY}
                  fill={color}
                />
              ) : null;
            })
          )}
        </g>
      )}
      
      {!showHeatmap && shots.map((shot, index) => (
        <circle
          key={index}
          cx={shot.x * scaleX}
          cy={shot.y * scaleY}
          r={shot.made ? 5 : 4}
          className={shot.made ? "fill-success stroke-success" : "fill-destructive stroke-destructive"}
          strokeWidth="2"
          opacity="0.7"
          data-testid={`shot-${index}`}
        />
      ))}
    </svg>
  );
}
