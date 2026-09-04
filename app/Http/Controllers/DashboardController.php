<?php

namespace App\Http\Controllers;

use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use App\Models\TicketStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $countsByStatus = Ticket::query()
            ->visibleTo($user)
            ->selectRaw('ticket_status_id, count(*) as aggregate')
            ->groupBy('ticket_status_id')
            ->pluck('aggregate', 'ticket_status_id');

        $statuses = TicketStatus::query()->ordered()->get();

        $recent = Ticket::query()
            ->visibleTo($user)
            ->with(['status', 'software', 'creator'])
            ->latest()
            ->take(6)
            ->get();

        $total = (int) $countsByStatus->sum();
        $resolved = (int) $statuses->where('is_resolved', true)->sum(fn ($s) => $countsByStatus[$s->id] ?? 0);
        $closed = (int) $statuses->where('is_terminal', true)->sum(fn ($s) => $countsByStatus[$s->id] ?? 0);

        return Inertia::render('dashboard', [
            'summary' => [
                'total' => $total,
                'open' => $total - $resolved - $closed,
                'resolved' => $resolved,
                'closed' => $closed,
                'by_status' => $statuses->map(fn (TicketStatus $status) => [
                    'slug' => $status->slug,
                    'name' => $status->name,
                    'color' => $status->color,
                    'count' => (int) ($countsByStatus[$status->id] ?? 0),
                ])->values(),
            ],
            'recent' => TicketResource::collection($recent),
        ]);
    }
}
