import { useState, useEffect } from "react";
import { type PlayEvent } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface PlayByPlayCourtProps {
  plays: PlayEvent[];
  homeTeamColor?: string;
  awayTeamColor?: string;
}

export function PlayByPlayCourt({ 
  plays, 
  homeTeamColor = "#1e3a8a", 
  awayTeamColor = "#991b1b" 
}: PlayByPlayCourtProps) {
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const courtWidth = 800;
  const courtHeight = 470;

  const currentPlay = plays[currentPlayIndex] || plays[0];

  useEffect(() => {
    if (!isPlaying || !plays.length) return;

    const interval = setInterval(() => {
      setCurrentPlayIndex(prev => {
        if (prev >= plays.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, plays.length, playbackSpeed]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentPlayIndex(Math.max(0, currentPlayIndex - 1));
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentPlayIndex(Math.min(plays.length - 1, currentPlayIndex + 1));
    setIsPlaying(false);
  };

  const handleSliderChange = (value: number[]) => {
    setCurrentPlayIndex(value[0]);
    setIsPlaying(false);
  };

  if (!plays.length) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <p className="text-muted-foreground" data-testid="text-no-plays">No play-by-play data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-card-border rounded-lg p-6">
        <svg
          viewBox={`0 0 ${courtWidth} ${courtHeight}`}
          className="w-full"
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          <rect width={courtWidth} height={courtHeight} className="fill-court-wood" />
          
          <g className="stroke-court-lines" strokeWidth="3" fill="none">
            <rect x="20" y="20" width={courtWidth - 40} height={courtHeight - 40} />
            <line x1={courtWidth / 2} y1="20" x2={courtWidth / 2} y2={courtHeight - 20} />
            <circle cx={courtWidth / 2} cy={courtHeight / 2} r="80" />
            
            <rect x="20" y={courtHeight / 2 - 150} width="200" height="300" />
            <rect x={courtWidth - 220} y={courtHeight / 2 - 150} width="200" height="300" />
          </g>
          
          {currentPlay.home_positions?.map((player, idx) => (
            <g key={`home-${idx}`}>
              <circle
                cx={player.x * (courtWidth / 94)}
                cy={player.y * (courtHeight / 50)}
                r="16"
                fill={homeTeamColor}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-500"
              />
              <text
                x={player.x * (courtWidth / 94)}
                y={player.y * (courtHeight / 50)}
                textAnchor="middle"
                dy=".3em"
                className="fill-white text-xs font-bold font-mono"
              >
                {player.jersey_number}
              </text>
            </g>
          ))}
          
          {currentPlay.away_positions?.map((player, idx) => (
            <g key={`away-${idx}`}>
              <circle
                cx={player.x * (courtWidth / 94)}
                cy={player.y * (courtHeight / 50)}
                r="16"
                fill={awayTeamColor}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-500"
              />
              <text
                x={player.x * (courtWidth / 94)}
                y={player.y * (courtHeight / 50)}
                textAnchor="middle"
                dy=".3em"
                className="fill-white text-xs font-bold font-mono"
              >
                {player.jersey_number}
              </text>
            </g>
          ))}
          
          {currentPlay.ball_position && (
            <circle
              cx={currentPlay.ball_position.x * (courtWidth / 94)}
              cy={currentPlay.ball_position.y * (courtHeight / 50)}
              r="8"
              className="fill-nba-orange stroke-black transition-all duration-500"
              strokeWidth="1.5"
            />
          )}
        </svg>
        
        <div className="mt-4 text-center space-y-2">
          <div className="flex justify-between text-sm font-mono">
            <span className="font-semibold" data-testid="text-period">Q{currentPlay.period}</span>
            <span className="font-semibold" data-testid="text-clock">{currentPlay.clock}</span>
            <span className="font-semibold" data-testid="text-score">
              {currentPlay.score_away} - {currentPlay.score_home}
            </span>
          </div>
          <p className="text-sm" data-testid="text-play-description">{currentPlay.description}</p>
        </div>
      </div>
      
      <div className="bg-card border border-card-border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium min-w-20">
            Play {currentPlayIndex + 1} / {plays.length}
          </span>
          <Slider
            value={[currentPlayIndex]}
            onValueChange={handleSliderChange}
            max={plays.length - 1}
            step={1}
            className="flex-1"
            data-testid="slider-play-timeline"
          />
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentPlayIndex === 0}
            data-testid="button-previous-play"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            size="icon"
            onClick={handlePlayPause}
            data-testid="button-play-pause"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            size="icon"
            variant="outline"
            onClick={handleNext}
            disabled={currentPlayIndex === plays.length - 1}
            data-testid="button-next-play"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          
          <div className="flex gap-1 ml-4">
            {[0.5, 1, 2].map(speed => (
              <Button
                key={speed}
                size="sm"
                variant={playbackSpeed === speed ? "default" : "outline"}
                onClick={() => setPlaybackSpeed(speed)}
                className="text-xs px-3"
                data-testid={`button-speed-${speed}x`}
              >
                {speed}x
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
