<?php

namespace App\Actions\Tickets;

use App\Models\Ticket;
use App\Models\TicketComment;
use App\Models\User;
use Illuminate\Http\UploadedFile;

class StoreTicketAttachments
{
    /**
     * Persist uploaded files and attach them to a ticket (optionally to a comment).
     *
     * @param  array<int, UploadedFile>  $files
     */
    public function handle(Ticket $ticket, User $uploader, array $files, ?TicketComment $comment = null): void
    {
        foreach (array_filter($files) as $file) {
            $path = $file->store("tickets/{$ticket->id}", 'local');

            $ticket->attachments()->create([
                'ticket_comment_id' => $comment?->id,
                'user_id' => $uploader->id,
                'disk' => 'local',
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
                'size' => $file->getSize() ?: 0,
            ]);
        }
    }
}
