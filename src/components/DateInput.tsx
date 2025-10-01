import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CalendarIcon, MapPin, Check } from "lucide-react";
import { format, parse, setMonth, setYear, getMonth, getYear } from "date-fns";
import { cn } from "@/lib/utils";
import { countries } from "@/utils/countries";

interface DateInputProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  country: string | undefined;
  onCountryChange: (country: string | undefined) => void;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

export const DateInput = ({ date, onDateChange, country, onCountryChange }: DateInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [calendarMonth, setCalendarMonth] = useState<Date>(date || new Date());
  const [countryOpen, setCountryOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    setError("");

    // Auto-format as DD/MM/YYYY
    let formatted = value;
    if (value.length >= 2) {
      formatted = value.slice(0, 2);
      if (value.length >= 4) {
        formatted += "/" + value.slice(2, 4);
        if (value.length >= 8) {
          formatted += "/" + value.slice(4, 8);
        } else if (value.length > 4) {
          formatted += "/" + value.slice(4);
        }
      } else if (value.length > 2) {
        formatted += "/" + value.slice(2);
      }
    }

    setInputValue(formatted);

    // Parse when complete (8 digits = dd/mm/yyyy)
    if (value.length === 8) {
      try {
        const parsedDate = parse(formatted, "dd/MM/yyyy", new Date());

        // Validate the date
        if (isNaN(parsedDate.getTime())) {
          setError("Invalid date");
          return;
        }

        if (parsedDate > new Date()) {
          setError("Date cannot be in the future");
          return;
        }

        if (parsedDate < new Date("1900-01-01")) {
          setError("Date must be after 1900");
          return;
        }

        onDateChange(parsedDate);
        setInputValue("");
      } catch {
        setError("Invalid date");
      }
    }
  };

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

      <div className="space-y-4">
        {/* Text Input */}
        <div>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="DD/MM/YYYY"
            value={inputValue}
            onChange={handleInputChange}
            className={cn(
              "w-full h-14 text-lg text-center glass hover:glow-purple transition-all",
              error && "border-destructive"
            )}
          />
          {error && (
            <p className="text-sm text-destructive mt-2 text-center">{error}</p>
          )}
        </div>

        {/* Or Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        {/* Calendar Picker */}
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
            <div className="p-4 space-y-2">
              <div className="flex gap-2">
                <Select
                  value={getMonth(calendarMonth).toString()}
                  onValueChange={(value) => {
                    const newDate = setMonth(calendarMonth, parseInt(value));
                    setCalendarMonth(newDate);
                  }}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={month} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={getYear(calendarMonth).toString()}
                  onValueChange={(value) => {
                    const newDate = setYear(calendarMonth, parseInt(value));
                    setCalendarMonth(newDate);
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Country Selector */}
        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-14 text-lg glass hover:glow-purple transition-all",
                !country && "text-muted-foreground"
              )}
            >
              <MapPin className="mr-2 h-5 w-5" />
              {country ? countries.find((c) => c.name === country)?.name : "Select country (optional)"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 glass" align="center">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {countries.map((c) => (
                    <CommandItem
                      key={c.code}
                      value={c.name}
                      onSelect={(value) => {
                        onCountryChange(value === country ? undefined : value);
                        setCountryOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          country === c.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {c.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {date && (
        <div className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">
          Selected: {format(date, "MMMM d, yyyy")}
          {country && ` • ${country}`}
        </div>
      )}
    </div>
  );
};
