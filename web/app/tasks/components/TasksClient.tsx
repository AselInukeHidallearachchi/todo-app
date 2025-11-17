"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TaskCard } from "./TaskCard";
import { TaskHeader } from "./TaskHeader";
import { SearchInput } from "./SearchInput";
import { EmptyState } from "./EmptyState";
import { TaskPagination } from "./TaskPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Loader2 } from "lucide-react";
import { deleteTaskAction } from "@/app/actions/tasks";
import { toast } from "sonner";
import { Task, PaginationMeta } from "@/types/task";
import { useDebounce } from "@/hooks/useDebounce";
import { UnifiedAlert } from "@/components/UnifiedAlert";

interface TasksClientProps {
  initialTasks: Task[];
  initialPagination: PaginationMeta;
  initialFilters: {
    status: string;
    priority: string;
    search: string;
  };
}

/**
 * Client Component: Tasks List with Filters
 * Manages URL-based filtering, searching, and pagination
 * Updates URL params to enable shareable filtered views
 */
export function TasksClient({
  initialTasks,
  initialPagination,
  initialFilters,
}: TasksClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for immediate UI feedback
  const [searchInput, setSearchInput] = useState(initialFilters.search);

  // Delete confirmation state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  // Debounce search input for auto-search
  const debouncedSearch = useDebounce(searchInput, 500);

  /**
   * Updates URL search params, which triggers server re-fetch
   */
  const updateFilters = (
    updates: Partial<typeof initialFilters & { page?: number }>
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    console.log("🔵 [Client] updateFilters called with:", updates);
    console.log("🔵 [Client] Current searchParams:", searchParams.toString());

    // Update each filter
    Object.entries(updates).forEach(([key, value]) => {
      if (key === "page") {
        // Handle page parameter separately
        if (value) {
          params.set("page", String(value));
        }
      } else if (value && value !== "all" && value !== "") {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change (unless we're explicitly setting page)
    if (!updates.hasOwnProperty("page")) {
      params.delete("page");
    }

    const newUrl = `/tasks?${params.toString()}`;
    console.log("🔵 [Client] Final URL:", newUrl);

    startTransition(() => {
      router.push(newUrl);
    });
  };

  /**
   * Auto-search when debounced value changes
   */
  useEffect(() => {
    if (debouncedSearch !== initialFilters.search) {
      updateFilters({ search: debouncedSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  /**
   * Handle search input change
   */
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  /**
   * Handle pagination
   */
  const handlePageChange = (page: number) => {
    console.log("🔵 [Client] Pagination clicked - changing to page:", page);
    console.log(
      "🔵 [Client] Current page from initialPagination:",
      initialPagination.current_page
    );
    updateFilters({ page });
  };

  /**
   * Handle delete button click - opens confirmation dialog
   */
  const handleDeleteClick = (taskId: number) => {
    setTaskToDelete(taskId);
    setDeleteOpen(true);
  };

  /**
   * Handle confirmed deletion
   */
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    setDeleting(true);

    try {
      const result = await deleteTaskAction(taskToDelete);

      if (result.success) {
        toast.success("Task deleted successfully");

        // If last task on page, go to previous page
        if (initialTasks.length === 1 && initialPagination.current_page > 1) {
          handlePageChange(initialPagination.current_page - 1);
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.message || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("An error occurred while deleting the task");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setTaskToDelete(null);
    }
  };

  // Determine active filter for EmptyState
  const activeFilter =
    initialFilters.status !== "all"
      ? initialFilters.status
      : initialFilters.priority !== "all"
      ? initialFilters.priority
      : initialFilters.search !== ""
      ? "search"
      : "all";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ✅ 1. Task Header with Count */}
      <TaskHeader taskCount={initialPagination.total} />

      {/* ✅ 2. Filters Section */}
      <div className="bg-card border rounded-lg p-4 space-y-4 shadow-soft">
        {/* Search Bar with Auto-complete */}
        <SearchInput
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search tasks by title or description..."
          isLoading={isPending}
        />

        {/* Status and Priority Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Status
            </label>
            <Select
              value={initialFilters.status}
              onValueChange={(value) => updateFilters({ status: value })}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Priority
            </label>
            <Select
              value={initialFilters.priority}
              onValueChange={(value) => updateFilters({ priority: value })}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ✅ 4. Loading State */}
      {isPending && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* ✅ 5. Tasks Grid or Empty State */}
      {!isPending && (
        <>
          {initialTasks.length === 0 ? (
            <EmptyState filter={activeFilter} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {initialTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}

          {/* ✅ 6. Task Pagination Component */}
          <TaskPagination
            pagination={initialPagination}
            onPageChange={handlePageChange}
            isLoading={isPending}
          />
        </>
      )}

      {/* ✅ 7. UnifiedAlert for Delete Confirmation */}
      <UnifiedAlert
        type="confirm"
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        isLoading={deleting}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
