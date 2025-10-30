"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, ArrowUpDown } from "lucide-react";
import { SearchInput } from "./SearchInput";

interface TaskControlsProps {
  filterBy: string;
  sortBy: string;
  searchQuery: string;
  onFilterChange: (v: string) => void;
  onSortChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  isSearching?: boolean;
}

export function TaskControls({
  filterBy,
  sortBy,
  searchQuery,
  onFilterChange,
  onSortChange,
  onSearchChange,
  isSearching = false,
}: TaskControlsProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-card border border-border rounded-lg shadow-soft">
      {/* Search Input */}
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        isLoading={isSearching}
      />

      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Filter */}
        <div className="flex items-center gap-2 flex-1">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium whitespace-nowrap">Filter:</span>
          <Select value={filterBy} onValueChange={onFilterChange}>
            <SelectTrigger className="flex-1 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 flex-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium whitespace-nowrap">Sort:</span>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="flex-1 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="priority">By Priority</SelectItem>
              <SelectItem value="due-date">By Due Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
