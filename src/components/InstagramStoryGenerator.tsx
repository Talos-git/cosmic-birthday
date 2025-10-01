import { AgeStats } from "@/utils/ageCalculations";

interface Fact {
  category: string;
  text: string;
}

interface InstagramStoryGeneratorProps {
  type: "stats" | "facts";
  stats?: AgeStats;
  facts?: Fact[];
  birthDate?: Date;
}

export const InstagramStoryGenerator = ({
  type,
  stats,
  facts,
  birthDate,
}: InstagramStoryGeneratorProps) => {
  if (type === "stats" && stats && birthDate) {
    return (
      <div
        id="instagram-story-stats"
        className="absolute -left-[9999px] w-[1080px] h-[1920px] bg-gradient-to-br from-purple-900 via-pink-900 to-amber-900 flex flex-col p-16"
      >
        {/* Instagram Story Bar */}
        <div className="w-full h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 rounded-full mb-12"></div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-7xl font-black mb-4 text-white drop-shadow-2xl">
            Your Life in Numbers ✨
          </h1>
          <p className="text-4xl text-white font-semibold">
            Born on a {stats.dayOfWeek}
          </p>
        </div>

        {/* Main Stats */}
        <div className="flex flex-wrap gap-5 mb-8 px-16">
          {/* Years */}
          <div className="bg-slate-800/90 rounded-[24px] p-6 border border-white/10 min-h-[160px] relative" style={{ width: 'calc(50% - 10px)' }}>
            <div className="absolute top-0 left-0 right-0 flex items-center justify-center px-4" style={{ height: 'calc(100% - 80px)' }}>
              <div className="text-6xl font-black text-pink-300 text-center leading-tight">
                {stats.years}
              </div>
            </div>
            <div className="absolute bottom-6 left-0 right-0 text-2xl text-white font-bold text-center">Years Old 🎂</div>
          </div>

          {/* Total Days */}
          <div className="bg-slate-800/90 rounded-[24px] p-6 border border-white/10 min-h-[160px] relative" style={{ width: 'calc(50% - 10px)' }}>
            <div className="absolute top-0 left-0 right-0 flex items-center justify-center px-4" style={{ height: 'calc(100% - 80px)' }}>
              <div className="text-5xl font-black text-purple-300 text-center leading-tight">
                {stats.totalDays.toLocaleString()}
              </div>
            </div>
            <div className="absolute bottom-6 left-0 right-0 text-2xl text-white font-bold text-center">Total Days 📅</div>
          </div>

          {/* Next Birthday */}
          <div className="bg-slate-800/90 rounded-[24px] p-6 border border-white/10 min-h-[160px] relative" style={{ width: 'calc(50% - 10px)' }}>
            <div className="absolute top-0 left-0 right-0 flex items-center justify-center px-4" style={{ height: 'calc(100% - 80px)' }}>
              <div className="text-6xl font-black text-amber-300 text-center leading-tight">
                {stats.nextBirthdayDays}
              </div>
            </div>
            <div className="absolute bottom-6 left-0 right-0 text-2xl text-white font-bold text-center">Days to Birthday 🎉</div>
          </div>

          {/* Milestone */}
          {stats.nextMilestone && (
            <div className="bg-slate-800/90 rounded-[24px] p-6 border border-white/10 min-h-[160px] relative" style={{ width: 'calc(50% - 10px)' }}>
              <div className="absolute top-0 left-0 right-0 flex items-center justify-center px-4" style={{ height: 'calc(100% - 80px)' }}>
                <div className="text-6xl font-black text-fuchsia-300 text-center leading-tight">
                  {stats.nextMilestone.age}
                </div>
              </div>
              <div className="absolute bottom-6 left-0 right-0 text-2xl text-white font-bold text-center">
                Next Milestone ✨
              </div>
            </div>
          )}
        </div>

        {/* Time Stats */}
        <div className="grid grid-cols-3 gap-5 mb-12 px-16">
          <div className="bg-slate-800/90 rounded-[24px] p-6 border border-white/10 flex flex-col items-center justify-center min-h-[160px]">
            <div className="text-4xl font-black text-cyan-300 mb-2 text-center leading-tight">
              {stats.hours.toLocaleString()}
            </div>
            <div className="text-xl text-white/90 font-bold text-center">Hours ⏰</div>
          </div>
          <div className="bg-slate-800/90 rounded-[24px] p-6 border border-white/10 flex flex-col items-center justify-center min-h-[160px]">
            <div className="text-4xl font-black text-emerald-300 mb-2 text-center leading-tight">
              {stats.minutes.toLocaleString()}
            </div>
            <div className="text-xl text-white/90 font-bold text-center">Minutes ⏱️</div>
          </div>
          <div className="bg-slate-800/90 rounded-[24px] p-6 border border-white/10 flex flex-col items-center justify-center min-h-[160px]">
            <div className="text-3xl font-black text-orange-300 mb-2 text-center leading-tight">
              {stats.seconds.toLocaleString()}
            </div>
            <div className="text-xl text-white/90 font-bold text-center">Seconds ⚡</div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="text-center mt-auto pb-12">
          <p className="text-3xl text-white/70 font-bold">
            cosmic-birthday.onrender.com
          </p>
        </div>
      </div>
    );
  }

  if (type === "facts" && facts && facts.length > 0) {
    return (
      <div
        id="instagram-story-facts"
        className="absolute -left-[9999px] w-[1080px] h-[1920px] bg-gradient-to-br from-purple-900 via-pink-900 to-amber-900 flex flex-col p-20"
      >
        {/* Header */}
        <div className="text-center mb-16 mt-8">
          <h1 className="text-8xl font-bold mb-6 text-white drop-shadow-2xl">
            Your Personalized Facts ✨
          </h1>
          <p className="text-5xl text-white/90 font-medium">
            Interesting things about your birthday
          </p>
        </div>

        {/* Facts Grid - showing selected facts (max 3) */}
        <div className="flex-1 flex flex-col justify-center gap-8 mb-12">
          {facts.slice(0, 3).map((fact, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-[40px] p-12 border-2 border-white/20 shadow-2xl"
            >
              <div className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold text-2xl px-6 pb-5 rounded-full mb-6">
                {fact.category}
              </div>
              <div className="text-4xl text-white leading-relaxed font-small">
                {fact.text}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Branding */}
        <div className="text-center pb-8">
          <p className="text-4xl text-white/60 font-medium">
            cosmic-birthday.onrender.com
          </p>
        </div>
      </div>
    );
  }

  return null;
};
