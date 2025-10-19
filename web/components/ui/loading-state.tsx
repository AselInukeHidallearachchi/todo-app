import React from "react";

interface LoadingStateProps {
  message?: string;
  variant?: "spinner" | "skeleton" | "pulse";
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  variant = "spinner",
  className = "",
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        className={`flex flex-col items-center justify-center py-12 ${className}`}
      >
        <div className="h-8 w-8 rounded-full bg-primary animate-pulse mb-4" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <div className="relative h-10 w-10 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
