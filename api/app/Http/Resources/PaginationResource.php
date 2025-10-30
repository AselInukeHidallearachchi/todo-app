<?php

namespace App\Http\Resources;

class PaginationResource
{
    /**
     * Transform Laravel's paginator into FE-friendly format
     */
    public static function transform($paginatedData): array
    {
        return [
            'data' => $paginatedData->items(),
            'meta' => [
                'current_page' => $paginatedData->currentPage(),
                'from' => $paginatedData->firstItem(),
                'last_page' => $paginatedData->lastPage(),
                'path' => $paginatedData->path(),
                'per_page' => $paginatedData->perPage(),
                'to' => $paginatedData->lastItem(),
                'total' => $paginatedData->total(),
            ],
            'links' => [
                'first' => $paginatedData->url(1),
                'last'  => $paginatedData->url($paginatedData->lastPage()),
                'prev'  => $paginatedData->previousPageUrl(),
                'next'  => $paginatedData->nextPageUrl(),
            ],
        ];
    }
}
