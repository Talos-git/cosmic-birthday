import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton = () => {
  return (
    <div className="w-full space-y-4 animate-fade-in">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="glass animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-24 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
