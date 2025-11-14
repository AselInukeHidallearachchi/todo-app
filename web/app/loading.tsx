import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
          <Sparkles className="h-8 w-8 text-primary animate-spin" />
        </div>
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
}
