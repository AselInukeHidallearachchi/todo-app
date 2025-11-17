<?php

namespace App\Http\Resources;

class PaginationResource
{
    public static function transform($paginatedData): array
    {
        return [
            'data' => $paginatedData->items(),
            'current_page' => $paginatedData->currentPage(),
            'from' => $paginatedData->firstItem() ?? 0,
            'last_page' => $paginatedData->lastPage(),
            'path' => $paginatedData->path(),
            'per_page' => $paginatedData->perPage(),
            'to' => $paginatedData->lastItem() ?? 0,
            'total' => $paginatedData->total(),
        ];
    }
}
