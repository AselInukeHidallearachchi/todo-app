"use client";

import { useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search tasks by title or description...",
  isLoading = false,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
    // Focus after clear
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent input blur when clicking button
    e.preventDefault();
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />

      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search tasks"
        className="pl-9 pr-10 h-10"
        disabled={isLoading}
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          onMouseDown={handleMouseDown}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}
