<?php

namespace App\Http\Resources;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Ticket
 */
class TicketResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'title' => $this->title,
            'description' => $this->description,
            'type' => ['value' => $this->type->value, 'label' => $this->type->label()],
            'priority' => ['value' => $this->priority->value, 'label' => $this->priority->label()],
            'status' => TicketStatusResource::make($this->whenLoaded('status')),
            'software' => SoftwareResource::make($this->whenLoaded('software')),
            'creator' => UserSummaryResource::make($this->whenLoaded('creator')),
            'assignee' => UserSummaryResource::make($this->whenLoaded('assignee')),
            'comments_count' => $this->whenCounted('comments'),
            'attachments_count' => $this->whenCounted('attachments'),
            'comments' => TicketCommentResource::collection($this->whenLoaded('comments')),
            'activities' => TicketActivityResource::collection($this->whenLoaded('activities')),
            'attachments' => TicketAttachmentResource::collection($this->whenLoaded('attachments')),
            'first_responded_at' => $this->first_responded_at,
            'resolved_at' => $this->resolved_at,
            'closed_at' => $this->closed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
