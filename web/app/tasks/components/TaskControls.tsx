"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Filter } from "lucide-react";

interface TaskControlsProps {
  filterBy: string;
  sortBy: string;
  onFilterChange: (v: string) => void;
  onSortChange: (v: string) => void;
}

export function TaskControls({
  filterBy,
  sortBy,
  onFilterChange,
  onSortChange,
}: TaskControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-card border border-border rounded-lg shadow-soft">
      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filter:</span>
        <Select value={filterBy} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[150px] h-9 text-sm">
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
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Sort:</span>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[150px] h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Added</SelectItem>
            <SelectItem value="priority">By Priority</SelectItem>
            <SelectItem value="status">By Status</SelectItem>
            <SelectItem value="due-date">By Due Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
