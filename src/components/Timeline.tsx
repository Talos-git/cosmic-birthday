import { useState, useRef, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  const maxAge = 100;
  const progressPercentage = (currentAge / maxAge) * 100;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();

    if (isMobile) {
      // Vertical timeline on mobile
      const y = e.clientY - rect.top;
      const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));
      const age = Math.round((percentage / 100) * maxAge);
      setScrubberAge(age);
    } else {
      // Horizontal timeline on desktop
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const age = Math.round((percentage / 100) * maxAge);
      setScrubberAge(age);
    }
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

        {/* Timeline Track - Vertical on mobile, horizontal on desktop */}
        <div
          ref={timelineRef}
          className="relative cursor-pointer select-none
                     h-[600px] w-24 mx-auto mb-8
                     md:h-24 md:w-auto md:mb-12"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Background track */}
          <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-muted rounded-full transform -translate-x-1/2
                          md:top-1/2 md:left-0 md:right-0 md:h-2 md:w-auto md:-translate-y-1/2 md:translate-x-0" />

          {/* Progress track */}
          <div
            className="absolute left-1/2 top-0 w-2 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full transform -translate-x-1/2 transition-all duration-300
                       md:top-1/2 md:left-0 md:h-2 md:w-auto md:-translate-y-1/2 md:translate-x-0 md:bg-gradient-to-r"
            style={isMobile ? {
              height: `${progressPercentage}%`
            } : {
              width: `${progressPercentage}%`
            }}
          />

          {/* Milestones */}
          <div className="relative h-full w-full">
            {milestones.map((age) => {
              const position = (age / maxAge) * 100;
              const isPassed = age <= currentAge;
              const isHovered = hoveredAge === age;

              return (
                <div
                  key={age}
                  className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2
                             md:top-1/2"
                  style={isMobile ? {
                    top: `${position}%`,
                    left: '50%'
                  } : {
                    left: `${position}%`,
                    top: '50%'
                  }}
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
                      "absolute left-8 top-1/2 transform -translate-y-1/2 text-xs font-medium transition-all duration-300 whitespace-nowrap md:left-1/2 md:top-6 md:-translate-x-1/2 md:translate-y-0",
                      isPassed ? "text-foreground" : "text-muted-foreground",
                      isHovered && "scale-125 text-purple-400"
                    )}
                  >
                    {age}
                  </div>

                  {/* Hover tooltip */}
                  {isHovered && (
                    <div className="absolute left-16 top-1/2 transform -translate-y-1/2 glass p-3 rounded-lg shadow-xl min-w-[200px] text-left animate-fade-in-scale z-10 md:left-1/2 md:top-auto md:bottom-12 md:-translate-x-1/2 md:translate-y-0 md:text-center">
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
          </div>

          {/* Draggable scrubber */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150
                       md:top-1/2"
            style={isMobile ? {
              top: `${(scrubberAge / maxAge) * 100}%`,
              left: '50%'
            } : {
              left: `${(scrubberAge / maxAge) * 100}%`,
              top: '50%'
            }}
          >
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 border-2 border-white shadow-lg cursor-grab active:cursor-grabbing animate-pulse" />
              {isDragging && (
                <div className="absolute left-10 top-1/2 transform -translate-y-1/2 glass px-3 py-1 rounded-lg whitespace-nowrap md:left-1/2 md:-top-12 md:-translate-x-1/2 md:translate-y-0">
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
