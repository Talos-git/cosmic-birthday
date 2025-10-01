import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPersonalizedFacts } from "@/services/supabase";
import { FactCard } from "./FactCard";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FactsSectionProps {
  birthDate: Date;
  currentAge: number;
  country?: string;
}

export const FactsSection = ({ birthDate, currentAge, country }: FactsSectionProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["personalizedFacts", birthDate.toISOString(), currentAge, country, refreshKey],
    queryFn: () => fetchPersonalizedFacts(birthDate, currentAge, country),
    retry: 2,
  });

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    refetch();
  };

  // Debug: log the response data
  console.log("Facts data:", data);

  // Transform nested object structure to flat array
  const facts = data?.facts ? (() => {
    const factsObj = data.facts;
    const result = [];

    // Map category names to display names
    const categoryMap = {
      historicalEvents: "Historical Events",
      popCulture: "Pop Culture",
      technologyMilestones: "Technology Milestones",
      celebrityBirthdays: "Celebrity Birthdays",
      funComparisons: "Fun Comparisons"
    };

    // Flatten all categories into a single array
    for (const [key, value] of Object.entries(factsObj)) {
      if (Array.isArray(value)) {
        value.forEach((text) => {
          result.push({
            category: categoryMap[key] || key,
            text: text
          });
        });
      }
    }

    return result;
  })() : [];

  return (
    <div className="w-full max-w-7xl mx-auto mt-12 animate-fade-in" style={{ animationDelay: '700ms' }}>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-accent" />
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            Your Personalized Facts
          </h2>
          <Sparkles className="w-6 h-6 text-accent" />
        </div>
        <p className="text-muted-foreground">
          Discover interesting facts about your birthday and lifetime
        </p>
      </div>

      {isLoading && <LoadingSkeleton />}

      {error && (
        <div className="space-y-4 animate-fade-in">
          <Alert variant="destructive" className="glass">
            <AlertDescription>
              Failed to load personalized facts. Please try again.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="glass hover:glow-purple transition-all"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {data && facts.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facts.map((fact, index) => (
              <FactCard key={index} fact={fact} index={index} />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="glass hover:glow-purple transition-all"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Facts
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
