<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * The requester-facing area (personal dashboard, "mis tickets", ticket creation)
 * is not for administrators — they have their own panel. Send them there,
 * mapping a ticket detail URL to its admin equivalent when possible.
 */
class RedirectAdminsToPanel
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user?->isAdmin()) {
            $ticket = $request->route('ticket');

            if ($ticket) {
                return redirect()->route('admin.tickets.show', $ticket);
            }

            return redirect()->route('admin.dashboard');
        }

        return $next($request);
    }
}
