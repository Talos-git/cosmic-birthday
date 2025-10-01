import { PersonalizedFact } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface FactCardProps {
  fact: PersonalizedFact;
  index: number;
  isSelected?: boolean;
  onSelect?: (factIndex: number, checked: boolean) => void;
  disabled?: boolean;
}

export const FactCard = ({ fact, index, isSelected = false, onSelect, disabled = false }: FactCardProps) => {
  return (
    <Card
      className={cn(
        "glass hover:scale-105 transition-all duration-300 animate-slide-up",
        isSelected && "ring-2 ring-purple-400"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <Badge className="bg-gradient-to-r from-purple-400 to-pink-400" variant="secondary">
            {fact.category}
          </Badge>
          {onSelect && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(index, checked as boolean)}
              disabled={disabled && !isSelected}
              className="shrink-0"
            />
          )}
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">{fact.text}</p>
      </CardContent>
    </Card>
  );
};
