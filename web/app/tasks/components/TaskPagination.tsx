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

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: Array<number | string> = [];
    let l: number | undefined;

    for (let i = 1; i <= last_page; i++) {
      if (
        i === 1 ||
        i === last_page ||
        (i >= current_page - delta && i <= current_page + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (last_page <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col gap-4 mt-8">
      {/* Item Count Display */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {from} to {to} of {total} tasks
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
