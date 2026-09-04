<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\TicketStats;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class StatisticsController extends Controller
{
    public function index(Request $request, TicketStats $stats): Response
    {
        $validated = $request->validate([
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'months' => ['nullable', 'integer', 'min:3', 'max:24'],
        ]);

        $from = ! empty($validated['from']) ? Carbon::parse($validated['from'])->startOfDay() : null;
        $to = ! empty($validated['to']) ? Carbon::parse($validated['to'])->endOfDay() : null;
        $months = $validated['months'] ?? 6;

        return Inertia::render('admin/statistics', [
            'filters' => [
                'from' => $validated['from'] ?? null,
                'to' => $validated['to'] ?? null,
                'months' => $months,
            ],
            'byStatus' => $stats->byStatus($from, $to),
            'byPriority' => $stats->byPriority($from, $to),
            'byType' => $stats->byType($from, $to),
            'bySoftware' => $stats->bySoftware($from, $to),
            'byUser' => $stats->byUser(8, $from, $to),
            'trend' => $stats->createdVsResolved($months),
            'averageResolutionHours' => $stats->averageResolutionHours($from, $to),
        ]);
    }
}
