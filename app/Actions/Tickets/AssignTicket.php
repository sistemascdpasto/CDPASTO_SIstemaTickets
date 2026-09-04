<?php

namespace App\Actions\Tickets;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AssignTicket
{
    public function handle(Ticket $ticket, ?User $assignee, User $actor): Ticket
    {
        if ($ticket->assigned_to === $assignee?->id) {
            return $ticket;
        }

        return DB::transaction(function () use ($ticket, $assignee, $actor) {
            $previous = $ticket->assignee;

            $ticket->assigned_to = $assignee?->id;
            $ticket->save();

            $ticket->activities()->create([
                'user_id' => $actor->id,
                'action' => $assignee ? 'assigned' : 'unassigned',
                'description' => $assignee
                    ? "Ticket asignado a {$assignee->name}."
                    : 'Se retiró la asignación del ticket.',
                'properties' => [
                    'from' => $previous?->only('id', 'name'),
                    'to' => $assignee?->only('id', 'name'),
                ],
            ]);

            return $ticket;
        });
    }
}
