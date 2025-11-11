<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttachmentResource extends JsonResource
{
    public function toArray(Request $request){
        return [
            'id'=>$this->id,
            'task_id'=>$this->task_id,
            'original_name' => $this->original_name,
            'path' => $this->path,
            'mime_type' => $this->mime_type,
            'size_bytes' => $this->size_bytes,
            'uploader' => [
                'id' => $this->uploader->id,
                'name' => $this->uploader->name,
            ],
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),

        ];
    }
}
