import { ReactNode } from "react";
import CountUp from "react-countup";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  delay?: number;
  glow?: boolean;
  animate?: boolean;
}

export const StatCard = ({
  icon,
  label,
  value,
  subtext,
  delay = 0,
  glow = false,
  animate = true
}: StatCardProps) => {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  const isNumeric = !isNaN(numericValue);

  return (
    <Card
      className={cn(
        "glass hover:scale-105 transition-all duration-300 animate-slide-up",
        glow && "glow-purple"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-3 text-primary">
          {icon}
        </div>
        <div className="text-4xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {animate && isNumeric ? (
            <CountUp
              end={numericValue}
              duration={1.5}
              delay={delay / 1000}
              separator=","
              preserveValue
            />
          ) : (
            value
          )}
        </div>
        <div className="text-sm font-medium text-foreground/80 mb-1">
          {label}
        </div>
        {subtext && (
          <div className="text-xs text-muted-foreground">
            {subtext}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
