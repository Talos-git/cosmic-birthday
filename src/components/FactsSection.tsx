import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPersonalizedFacts } from "@/services/supabase";
import { FactCard } from "./FactCard";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { InstagramStoryGenerator } from "./InstagramStoryGenerator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Instagram } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { shareStoryToInstagram } from "@/utils/shareToInstagram";
import { toast } from "sonner";

interface FactsSectionProps {
  birthDate: Date;
  currentAge: number;
  country?: string;
  stats?: any;
}

export const FactsSection = ({ birthDate, currentAge, country, stats }: FactsSectionProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedFactIndices, setSelectedFactIndices] = useState<number[]>([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["personalizedFacts", birthDate.toISOString(), currentAge, country, refreshKey],
    queryFn: () => fetchPersonalizedFacts(birthDate, currentAge, country),
    retry: 2,
  });

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    setSelectedFactIndices([]);
    refetch();
  };

  const handleFactSelection = (index: number, checked: boolean) => {
    if (checked) {
      // Add to selection if less than 2 facts are selected
      if (selectedFactIndices.length < 2) {
        setSelectedFactIndices([...selectedFactIndices, index]);
      }
    } else {
      // Remove from selection
      setSelectedFactIndices(selectedFactIndices.filter((i) => i !== index));
    }
  };

  const handleShareToInstagram = async () => {
    // If no facts are selected, ask user
    if (selectedFactIndices.length === 0) {
      const shouldAddFacts = window.confirm(
        "Would you like to add some facts (max 2) to the story? Select facts and try again, or click Cancel to continue without facts."
      );
      if (shouldAddFacts) {
        toast.info("Please select up to 2 facts to include in your story.");
        return;
      }
      // User clicked Cancel, continue without facts - still capture the section
    }

    setIsSharing(true);
    try {
      // If facts are selected, capture the Instagram story, otherwise capture all
      const result = await shareStoryToInstagram(
        selectedFactIndices.length > 0 ? "instagram-story-combined" : "facts-section-all",
        `cosmic-birthday-facts-${new Date().getTime()}.png`
      );

      if (result.success) {
        if ("method" in result && result.method === "share") {
          toast.success("Shared successfully!");
        } else {
          toast.success("Image downloaded! You can now upload it to Instagram Stories.");
        }
      } else {
        if ("error" in result) {
          toast.error(result.error || "Failed to share");
        }
      }
    } catch (error) {
      toast.error("An error occurred while sharing");
      console.error(error);
    } finally {
      setIsSharing(false);
    }
  };

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
        <div className="space-y-4" id="facts-section-all">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              Select up to 2 facts to include in your Instagram Story ({selectedFactIndices.length}/2 selected)
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="all-facts-grid">
            {facts.map((fact, index) => (
              <FactCard
                key={index}
                fact={fact}
                index={index}
                isSelected={selectedFactIndices.includes(index)}
                onSelect={handleFactSelection}
                disabled={selectedFactIndices.length >= 2}
              />
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="glass hover:glow-purple transition-all"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Facts
            </Button>
            <Button
              onClick={handleShareToInstagram}
              disabled={isSharing}
              variant="outline"
              className="glass hover:glow-purple transition-all"
            >
              <Instagram className="w-4 h-4 mr-2" />
              {isSharing ? "Generating..." : "Share Facts to Instagram Stories"}
            </Button>
          </div>

          {/* Selected facts for Instagram Story */}
          {selectedFactIndices.length > 0 && (
            <div id="facts-story-content" className="hidden">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                  Your Personalized Facts ✨
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
                {selectedFactIndices.map(i => {
                  const fact = facts[i];
                  return (
                    <div key={i} className="glass p-6 rounded-2xl">
                      <Badge className="mb-3 bg-gradient-to-r from-purple-400 to-pink-400" variant="secondary">
                        {fact.category}
                      </Badge>
                      <p className="text-sm leading-relaxed text-foreground/90">{fact.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hidden Instagram Story Generator for Facts */}
          {selectedFactIndices.length > 0 && (
            <InstagramStoryGenerator
              stats={stats}
              birthDate={birthDate}
              facts={selectedFactIndices.map(i => facts[i])}
            />
          )}
        </div>
      )}
    </div>
  );
};
