"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationMeta } from "@/types/task";

interface TaskPaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function TaskPagination({
  pagination,
  onPageChange,
  isLoading = false,
}: TaskPaginationProps) {
  const { current_page, last_page, total, from, to } = pagination;

  // Generate page numbers with "..." in between
  const getPageNumbers = () => {
    const delta = 2; // How many pages to show around current page
    const range: number[] = []; // pages we will keep
    const rangeWithDots: Array<number | string> = []; // pages + "..."
    let lastAdded: number | undefined;

    // Add important page numbers
    for (let i = 1; i <= last_page; i++) {
      if (
        i === 1 || // first page
        i === last_page || // last page
        (i >= current_page - delta && i <= current_page + delta) // around active page
      ) {
        range.push(i);
      }
    }

    // Insert "..." where needed
    range.forEach((page) => {
      if (lastAdded) {
        if (page - lastAdded === 2) {
          rangeWithDots.push(lastAdded + 1); // directly next page
        } else if (page - lastAdded > 2) {
          rangeWithDots.push("..."); // gap too large → add ellipsis
        }
      }
      rangeWithDots.push(page);
      lastAdded = page;
    });

    return rangeWithDots;
  };

  if (last_page <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  // Calculate proper from/to if backend returns 0
  const displayFrom = from > 0 ? from : total > 0 ? 1 : 0;
  const displayTo = to > 0 ? to : Math.min(pagination.per_page, total);

  return (
    <div className="flex flex-col gap-4 mt-8">
      {/* Item Count Display */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {displayFrom} to {displayTo} of {total} tasks
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (current_page > 1 && !isLoading) {
                    onPageChange(current_page - 1);
                  }
                }}
                className={`${
                  current_page === 1 || isLoading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }`}
              />
            </PaginationItem>

            {/* Page Numbers */}
            {pageNumbers.map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => {
                      if (!isLoading) {
                        onPageChange(page as number);
                      }
                    }}
                    isActive={page === current_page}
                    className={`${
                      isLoading
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }`}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (current_page < last_page && !isLoading) {
                    onPageChange(current_page + 1);
                  }
                }}
                className={`${
                  current_page === last_page || isLoading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
