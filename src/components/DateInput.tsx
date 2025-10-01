import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateInputProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export const DateInput = ({ date, onDateChange }: DateInputProps) => {
  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
          When Were You Born?
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover your life in numbers and celebrate every moment
        </p>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-14 text-lg glass hover:glow-purple transition-all",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-5 w-5" />
            {date ? format(date, "PPP") : "Pick your birthday"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 glass" align="center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {date && (
        <div className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">
          Selected: {format(date, "MMMM d, yyyy")}
        </div>
      )}
    </div>
  );
};
