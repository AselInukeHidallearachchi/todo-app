"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { TaskHeader } from "./components/TaskHeader";
import { TaskControls } from "./components/TaskControls";
import { TaskCard } from "./components/TaskCard";
import { EmptyState } from "./components/EmptyState";
import { TaskPagination } from "./components/TaskPagination";
import { useDebounce } from "@/hooks/useDebounce";
import { Task, PaginationMeta } from "@/types/task";
import { PaginatedApiResponse } from "@/types/api";

export default function TaskListPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchTasks = useCallback(
    async (pageNum: number = 1) => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", pageNum.toString());
        params.append("per_page", "15");

        if (filterBy !== "all") params.append("status", filterBy);
        if (sortBy === "priority") params.append("sort", "priority");
        if (sortBy === "due-date") params.append("sort", "due_date");
        if (debouncedSearch && debouncedSearch.trim()) {
          params.append("search", debouncedSearch.trim());
        }

        const res = await api.get<PaginatedApiResponse<Task>>(
          `/tasks?${params.toString()}`
        );

        setTasks(Array.isArray(res.data.data?.data) ? res.data.data.data : []);
        setPagination((res.data.data?.meta as PaginationMeta) || null);
        setCurrentPage(pageNum);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    },
    [router, filterBy, sortBy, debouncedSearch]
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks]);

  const handlePageChange = (page: number) => {
    if (pagination) {
      fetchTasks(page);
    }
  };

  const deleteTask = async (id: number) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);

      setTasks((prev) => prev.filter((t) => t.id !== id));

      if (tasks.length === 1 && currentPage > 1 && pagination) {
        fetchTasks(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (loading && !pagination) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {pagination && <TaskHeader taskCount={pagination.total} />}

      <TaskControls
        filterBy={filterBy}
        sortBy={sortBy}
        searchQuery={searchQuery}
        onFilterChange={setFilterBy}
        onSortChange={setSortBy}
        onSearchChange={setSearchQuery}
      />

      {tasks.length === 0 ? (
        <EmptyState filter={filterBy} />
      ) : (
        <>
          <div className="grid gap-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onDelete={deleteTask} />
            ))}
          </div>

          {pagination && (
            <TaskPagination
              pagination={pagination}
              onPageChange={handlePageChange}
              isLoading={loading}
            />
          )}
        </>
      )}
    </div>
  );
}
