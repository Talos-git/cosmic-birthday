import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface TimelineProps {
  birthDate: Date;
  currentAge: number;
}

const milestones = [0, 5, 10, 15, 18, 21, 25, 30, 40, 50, 60, 70, 80, 90, 100];

const getMilestoneInfo = (age: number) => {
  const facts: Record<number, string> = {
    0: "Born into the world 🍼",
    5: "Starting school adventures 🎒",
    10: "Double digits! 🎉",
    15: "Teenage years begin 🎸",
    18: "Officially an adult 🎓",
    21: "Coming of age 🍾",
    25: "Quarter century 🌟",
    30: "Thriving thirties 💼",
    40: "Fabulous forties 🎯",
    50: "Golden half-century 👑",
    60: "Diamond jubilee 💎",
    70: "Platinum years 🌠",
    80: "Octogenarian wisdom ✨",
    90: "Nonagenarian legend 🏆",
    100: "Centenarian milestone! 🎊"
  };
  return facts[age] || `${age} years young`;
};

export const Timeline = ({ birthDate, currentAge }: TimelineProps) => {
  const [hoveredAge, setHoveredAge] = useState<number | null>(null);
  const [scrubberAge, setScrubberAge] = useState(currentAge);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const maxAge = 100;
  const progressPercentage = (currentAge / maxAge) * 100;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const age = Math.round((percentage / 100) * maxAge);
    setScrubberAge(age);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Card className="glass">
      <CardContent className="p-8">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Life's Journey Timeline
          </h3>
          <p className="text-sm text-muted-foreground">
            Explore milestones • Drag the scrubber to see different ages
          </p>
        </div>

        {/* Timeline Track */}
        <div
          ref={timelineRef}
          className="relative h-24 mb-8 cursor-pointer select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Background track */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-muted rounded-full transform -translate-y-1/2" />

          {/* Progress track */}
          <div
            className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform -translate-y-1/2 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />

          {/* Milestones */}
          {milestones.map((age) => {
            const position = (age / maxAge) * 100;
            const isPassed = age <= currentAge;
            const isHovered = hoveredAge === age;

            return (
              <div
                key={age}
                className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${position}%` }}
                onMouseEnter={() => setHoveredAge(age)}
                onMouseLeave={() => setHoveredAge(null)}
              >
                {/* Milestone dot */}
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 transition-all duration-300",
                    isPassed
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 scale-110"
                      : "bg-background border-muted-foreground/50",
                    isHovered && "scale-150 shadow-lg shadow-purple-500/50"
                  )}
                />

                {/* Age label */}
                <div
                  className={cn(
                    "absolute top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium transition-all duration-300 whitespace-nowrap",
                    isPassed ? "text-foreground" : "text-muted-foreground",
                    isHovered && "scale-125 text-purple-400"
                  )}
                >
                  {age}
                </div>

                {/* Hover tooltip */}
                {isHovered && (
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 glass p-3 rounded-lg shadow-xl min-w-[200px] text-center animate-fade-in-scale z-10">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="font-bold text-foreground">{age} Years</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {getMilestoneInfo(age)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Draggable scrubber */}
          <div
            className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150"
            style={{ left: `${(scrubberAge / maxAge) * 100}%` }}
          >
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 border-2 border-white shadow-lg cursor-grab active:cursor-grabbing animate-pulse" />
              {isDragging && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 glass px-3 py-1 rounded-lg whitespace-nowrap">
                  <span className="text-sm font-bold text-foreground">{scrubberAge} years</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current status */}
        <div className="text-center space-y-2">
          <p className="text-lg">
            <span className="text-muted-foreground">You are currently </span>
            <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {currentAge} years old
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            {getMilestoneInfo(
              milestones.filter((m) => m <= currentAge).pop() || 0
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
