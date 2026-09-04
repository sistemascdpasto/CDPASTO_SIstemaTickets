<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use App\Support\TicketStats;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(TicketStats $stats): Response
    {
        return Inertia::render('admin/dashboard', [
            'indicators' => $stats->indicators(),
            'trend' => $stats->createdVsResolved(6),
            'byPriority' => $stats->byPriority(),
            'byType' => $stats->byType(),
            'attention' => TicketResource::collection(
                Ticket::query()
                    ->whereNull('resolved_at')
                    ->whereNull('closed_at')
                    ->with(['status', 'software', 'creator', 'assignee'])
                    ->orderByRaw("case priority when 'urgent' then 4 when 'high' then 3 when 'medium' then 2 else 1 end desc")
                    ->latest()
                    ->take(6)
                    ->get()
            ),
        ]);
    }
}
