import { useState } from "react";
import { DateInput } from "@/components/DateInput";
import { AgeDisplay } from "@/components/AgeDisplay";

const Index = () => {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-bg opacity-20 -z-10" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 -z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto space-y-12">
        <DateInput date={birthDate} onDateChange={setBirthDate} />
        
        {birthDate && (
          <div className="animate-fade-in-scale">
            <AgeDisplay birthDate={birthDate} />
          </div>
        )}

        {!birthDate && (
          <div className="text-center space-y-4 max-w-2xl mx-auto animate-fade-in">
            <div className="glass rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                🎉 What You'll Discover
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <p className="text-muted-foreground">✨ Your exact age in years, months, and days</p>
                  <p className="text-muted-foreground">⏰ Real-time seconds counter</p>
                  <p className="text-muted-foreground">📅 Day of the week you were born</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">🎂 Countdown to your next birthday</p>
                  <p className="text-muted-foreground">🎯 Next milestone birthday tracker</p>
                  <p className="text-muted-foreground">💫 Beautiful live animations</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
