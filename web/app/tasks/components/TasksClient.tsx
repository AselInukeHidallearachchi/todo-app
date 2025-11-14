"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TaskHeader } from "./TaskHeader";
import { TaskControls } from "./TaskControls";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "./EmptyState";
import { TaskPagination } from "./TaskPagination";
import { useDebounce } from "@/hooks/useDebounce";
import { Task, PaginationMeta } from "@/types/task";
import { UnifiedAlert } from "@/components/UnifiedAlert";
import { deleteTaskAction } from "@/app/actions/tasks";

/**
 * Client Component: Tasks List Interactive Wrapper
 * Handles filtering, sorting, searching, pagination, and task deletion
 * Uses Server Action for deleting tasks (deleteTaskAction)
 * Uses URL search params for state management (shareable URLs)
 */

interface TasksClientProps {
  initialTasks: Task[];
  initialPagination: PaginationMeta;
  initialFilters: {
    filterBy: string;
    sortBy: string;
    searchQuery: string;
    page: number;
  };
}

export function TasksClient({
  initialTasks,
  initialPagination,
  initialFilters,
}: TasksClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [pagination] = useState<PaginationMeta>(initialPagination);
  const [filterBy, setFilterBy] = useState(initialFilters.filterBy);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy);
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Update URL and trigger server-side refetch when filters change
  const updateFilters = useCallback(
    (newFilters: Partial<typeof initialFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newFilters.filterBy) params.set("filter", newFilters.filterBy);
      if (newFilters.sortBy) params.set("sort", newFilters.sortBy);
      if (newFilters.searchQuery !== undefined) {
        if (newFilters.searchQuery) {
          params.set("search", newFilters.searchQuery);
        } else {
          params.delete("search");
        }
      }
      if (newFilters.page) {
        params.set("page", String(newFilters.page));
      } else {
        params.delete("page"); // Reset to page 1
      }

      // Navigate with new params (triggers server-side refetch)
      router.push(`/tasks?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Update filters when search changes
  useEffect(() => {
    updateFilters({ searchQuery: debouncedSearch, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Handle filter changes
  const handleFilterChange = (value: string) => {
    setFilterBy(value);
    updateFilters({ filterBy: value, page: 1 });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateFilters({ sortBy: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  // Handle task deletion with Server Action
  const deleteTask = (id: number) => {
    setTaskToDelete(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    setDeleting(true);
    setDeleteOpen(false);

    try {
      const result = await deleteTaskAction(taskToDelete);

      if (result.success) {
        // Optimistically update UI
        setTasks((prev) => prev.filter((t) => t.id !== taskToDelete));

        // If last task on page, go to previous page
        if (tasks.length === 1 && pagination.current_page > 1) {
          updateFilters({ page: pagination.current_page - 1 });
        } else {
          // Refresh current page
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setDeleting(false);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <TaskHeader taskCount={pagination.total} />

      <TaskControls
        filterBy={filterBy}
        sortBy={sortBy}
        searchQuery={searchQuery}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onSearchChange={setSearchQuery}
      />

      {tasks.length === 0 ? (
        <EmptyState filter={filterBy} />
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onDelete={deleteTask} />
            ))}
          </div>

          <TaskPagination
            pagination={pagination}
            onPageChange={handlePageChange}
            isLoading={false}
          />
        </>
      )}

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
