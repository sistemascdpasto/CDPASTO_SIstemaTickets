<?php

namespace App\Actions\Tickets;

use App\Models\Ticket;
use App\Models\TicketComment;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class AddTicketComment
{
    public function __construct(private readonly StoreTicketAttachments $attachments) {}

    /**
     * @param  array<int, UploadedFile>  $files
     */
    public function handle(Ticket $ticket, User $author, string $body, bool $internal = false, array $files = []): TicketComment
    {
        // Only administrators can post internal notes.
        $internal = $internal && $author->isAdmin();

        return DB::transaction(function () use ($ticket, $author, $body, $internal, $files) {
            $comment = $ticket->comments()->create([
                'user_id' => $author->id,
                'body' => $body,
                'is_internal' => $internal,
            ]);

            if ($files !== []) {
                $this->attachments->handle($ticket, $author, $files, $comment);
            }

            if ($author->isAdmin() && ! $internal && $ticket->first_responded_at === null) {
                $ticket->forceFill(['first_responded_at' => now()])->save();
            }

            return $comment;
        });
    }
}
