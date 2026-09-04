<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    /**
     * Administrators may do anything with tickets — except create them
     * (creating a request is a requester action), so `create` falls through.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($ability === 'create') {
            return null;
        }

        return $user->isAdmin() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Ticket $ticket): bool
    {
        return $ticket->user_id === $user->id || $ticket->assigned_to === $user->id;
    }

    public function create(User $user): bool
    {
        return ! $user->isAdmin();
    }

    /**
     * The requester may add a public follow-up on their own ticket.
     */
    public function comment(User $user, Ticket $ticket): bool
    {
        return $ticket->user_id === $user->id || $ticket->assigned_to === $user->id;
    }

    /**
     * Reserved for administrators (handled by before()).
     */
    public function manage(User $user, Ticket $ticket): bool
    {
        return false;
    }
}
