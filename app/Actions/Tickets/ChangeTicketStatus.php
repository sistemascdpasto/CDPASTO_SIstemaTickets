<?php

namespace App\Actions\Tickets;

use App\Models\Ticket;
use App\Models\TicketStatus;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ChangeTicketStatus
{
    public function handle(Ticket $ticket, TicketStatus $status, User $actor, ?string $note = null): Ticket
    {
        $from = $ticket->status;

        if ($from->id === $status->id && blank($note)) {
            return $ticket;
        }

        return DB::transaction(function () use ($ticket, $from, $status, $actor, $note) {
            $ticket->ticket_status_id = $status->id;

            if ($ticket->first_responded_at === null) {
                $ticket->first_responded_at = now();
            }

            if ($status->is_resolved && $ticket->resolved_at === null) {
                $ticket->resolved_at = now();
            }

            if ($status->is_terminal) {
                $ticket->closed_at ??= now();
            }

            // Reopened: clear resolution timestamps so metrics stay honest.
            if (! $status->is_resolved && ! $status->is_terminal) {
                $ticket->resolved_at = null;
                $ticket->closed_at = null;
            }

            $ticket->save();

            $ticket->activities()->create([
                'user_id' => $actor->id,
                'action' => 'status_changed',
                'description' => $note,
                'properties' => [
                    'from' => ['slug' => $from->slug, 'name' => $from->name],
                    'to' => ['slug' => $status->slug, 'name' => $status->name],
                ],
            ]);

            return $ticket;
        });
    }
}
