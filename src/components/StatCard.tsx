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
  solidColor?: boolean;
}

export const StatCard = ({
  icon,
  label,
  value,
  subtext,
  delay = 0,
  glow = false,
  animate = true,
  solidColor = false
}: StatCardProps) => {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  const isNumeric = !isNaN(numericValue);

  return (
    <Card
      className={cn(
        "glass hover:scale-105 transition-all duration-300 animate-slide-up",
        glow && "glow-purple",
        solidColor && "bg-slate-800/90 border-slate-700"
      )}
      style={{
        animationDelay: `${delay}ms`,
        ...(solidColor && { backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: '#475569' })
      }}
    >
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-3 text-purple-400" style={solidColor ? { color: '#e879f9' } : {}}>
          {icon}
        </div>
        <div className={cn(
          "text-4xl md:text-4xl font-bold mb-2",
          solidColor ? "text-pink-400" : "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
        )}
        style={solidColor ? { color: '#fb7185', fontWeight: '800' } : {}}>
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
        <div className={cn(
          "text-sm font-medium mb-1",
          solidColor ? "text-white" : "text-foreground/80"
        )}
        style={solidColor ? { color: '#ffffff', fontWeight: '600' } : {}}>
          {label}
        </div>
        {subtext && (
          <div className={cn(
            "text-xs",
            solidColor ? "text-gray-300" : "text-muted-foreground"
          )}
          style={solidColor ? { color: '#f3f4f6', fontWeight: '500' } : {}}>
            {subtext}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
