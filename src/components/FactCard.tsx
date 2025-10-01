import { PersonalizedFact } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FactCardProps {
  fact: PersonalizedFact;
  index: number;
}

export const FactCard = ({ fact, index }: FactCardProps) => {
  return (
    <Card
      className={cn(
        "glass hover:scale-105 transition-all duration-300 animate-slide-up"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <Badge className="mb-3 bg-gradient-to-r from-purple-400 to-pink-400" variant="secondary">
          {fact.category}
        </Badge>
        <p className="text-sm leading-relaxed text-foreground/90">{fact.text}</p>
      </CardContent>
    </Card>
  );
};
