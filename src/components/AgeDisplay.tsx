import { useEffect, useState } from "react";
import { StatCard } from "./StatCard";
import { calculateAge, formatNumber, type AgeStats } from "@/utils/ageCalculations";
import { Calendar, Clock, Sparkles, PartyPopper, Cake, Timer } from "lucide-react";

interface AgeDisplayProps {
  birthDate: Date;
}

export const AgeDisplay = ({ birthDate }: AgeDisplayProps) => {
  const [stats, setStats] = useState<AgeStats>(calculateAge(birthDate));

  useEffect(() => {
    // Update seconds counter every second
    const interval = setInterval(() => {
      setStats(calculateAge(birthDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [birthDate]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
          Your Life in Numbers ✨
        </h2>
        <p className="text-muted-foreground">
          You were born on a {stats.dayOfWeek}
        </p>
      </div>

      {/* Main Age Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<Cake className="w-8 h-8" />}
          label="Years Old"
          value={stats.years}
          delay={0}
          glow
        />
        <StatCard
          icon={<Calendar className="w-8 h-8" />}
          label="Months"
          value={stats.months}
          subtext="in current year"
          delay={100}
        />
        <StatCard
          icon={<Calendar className="w-8 h-8" />}
          label="Days"
          value={stats.days}
          subtext="since last birthday"
          delay={200}
        />
      </div>

      {/* Detailed Time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Total Days"
          value={formatNumber(stats.totalDays)}
          delay={300}
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Hours"
          value={formatNumber(stats.hours)}
          delay={350}
        />
        <StatCard
          icon={<Timer className="w-6 h-6" />}
          label="Minutes"
          value={formatNumber(stats.minutes)}
          delay={400}
        />
        <StatCard
          icon={<Timer className="w-6 h-6" />}
          label="Seconds"
          value={formatNumber(stats.seconds)}
          delay={450}
        />
      </div>

      {/* Milestone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          icon={<PartyPopper className="w-8 h-8" />}
          label="Next Birthday"
          value={stats.nextBirthdayDays}
          subtext="days to go"
          delay={500}
          glow
        />
        {stats.nextMilestone && (
          <StatCard
            icon={<Sparkles className="w-8 h-8" />}
            label={`Milestone: ${stats.nextMilestone.age} Years`}
            value={stats.nextMilestone.days}
            subtext="days until milestone"
            delay={550}
            glow
          />
        )}
      </div>
    </div>
  );
};
