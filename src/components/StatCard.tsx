import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  delay?: number;
  glow?: boolean;
}

export const StatCard = ({ icon, label, value, subtext, delay = 0, glow = false }: StatCardProps) => {
  return (
    <Card 
      className={cn(
        "glass hover:scale-105 transition-all duration-300",
        glow && "glow-purple"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-3 text-primary">
          {icon}
        </div>
        <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {value}
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
