<?php

namespace App\Support;

use App\Enums\TicketPriority;
use App\Enums\TicketType;
use App\Models\Ticket;
use App\Models\TicketStatus;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * Central place for every ticket aggregation shown on the admin dashboard
 * and the statistics page. Calculations run against real application data.
 */
class TicketStats
{
    /**
     * Headline indicators for the admin dashboard.
     *
     * @return array<string, mixed>
     */
    public function indicators(): array
    {
        $now = Carbon::now();
        $byStatus = Ticket::query()
            ->selectRaw('ticket_status_id, count(*) as aggregate')
            ->groupBy('ticket_status_id')
            ->pluck('aggregate', 'ticket_status_id');

        $statuses = TicketStatus::query()->ordered()->get();

        return [
            'total' => (int) $byStatus->sum(),
            'by_status' => $statuses->map(fn (TicketStatus $status) => [
                'slug' => $status->slug,
                'name' => $status->name,
                'color' => $status->color,
                'count' => (int) ($byStatus[$status->id] ?? 0),
            ])->all(),
            'high_priority' => Ticket::query()
                ->whereIn('priority', [TicketPriority::High->value, TicketPriority::Urgent->value])
                ->whereNull('resolved_at')
                ->count(),
            'unassigned' => Ticket::query()->whereNull('assigned_to')->whereNull('resolved_at')->count(),
            'created_today' => Ticket::query()->whereDate('created_at', $now->toDateString())->count(),
            'created_week' => Ticket::query()->where('created_at', '>=', $now->copy()->startOfWeek())->count(),
            'created_month' => Ticket::query()->where('created_at', '>=', $now->copy()->startOfMonth())->count(),
            'resolved_month' => Ticket::query()->where('resolved_at', '>=', $now->copy()->startOfMonth())->count(),
            'average_resolution_hours' => $this->averageResolutionHours(),
        ];
    }

    /**
     * @return list<array{label: string, value: int, key: string}>
     */
    public function byStatus(?Carbon $from = null, ?Carbon $to = null): array
    {
        $counts = $this->baseQuery($from, $to)
            ->selectRaw('ticket_status_id, count(*) as aggregate')
            ->groupBy('ticket_status_id')
            ->pluck('aggregate', 'ticket_status_id');

        return TicketStatus::query()->ordered()->get()
            ->map(fn (TicketStatus $status) => [
                'key' => $status->slug,
                'label' => $status->name,
                'value' => (int) ($counts[$status->id] ?? 0),
            ])->all();
    }

    /**
     * @return list<array{label: string, value: int, key: string}>
     */
    public function byPriority(?Carbon $from = null, ?Carbon $to = null): array
    {
        $counts = $this->baseQuery($from, $to)
            ->selectRaw('priority, count(*) as aggregate')
            ->groupBy('priority')
            ->pluck('aggregate', 'priority');

        return collect(TicketPriority::cases())
            ->map(fn (TicketPriority $priority) => [
                'key' => $priority->value,
                'label' => $priority->label(),
                'value' => (int) ($counts[$priority->value] ?? 0),
            ])->all();
    }

    /**
     * @return list<array{label: string, value: int, key: string}>
     */
    public function byType(?Carbon $from = null, ?Carbon $to = null): array
    {
        $counts = $this->baseQuery($from, $to)
            ->selectRaw('type, count(*) as aggregate')
            ->groupBy('type')
            ->pluck('aggregate', 'type');

        return collect(TicketType::cases())
            ->map(fn (TicketType $type) => [
                'key' => $type->value,
                'label' => $type->label(),
                'value' => (int) ($counts[$type->value] ?? 0),
            ])->all();
    }

    /**
     * @return list<array{label: string, value: int, key: string}>
     */
    public function bySoftware(?Carbon $from = null, ?Carbon $to = null): array
    {
        return $this->baseQuery($from, $to)
            ->selectRaw('software_id, count(*) as aggregate')
            ->groupBy('software_id')
            ->with('software:id,name')
            ->get()
            ->map(fn (Ticket $row) => [
                'key' => (string) $row->software_id,
                'label' => $row->software?->name ?? '—',
                'value' => (int) $row->aggregate,
            ])
            ->sortByDesc('value')
            ->values()
            ->all();
    }

    /**
     * @return list<array{label: string, value: int, key: string}>
     */
    public function byUser(int $limit = 8, ?Carbon $from = null, ?Carbon $to = null): array
    {
        return $this->baseQuery($from, $to)
            ->selectRaw('user_id, count(*) as aggregate')
            ->groupBy('user_id')
            ->with('creator:id,name')
            ->get()
            ->map(fn (Ticket $row) => [
                'key' => (string) $row->user_id,
                'label' => $row->creator?->name ?? '—',
                'value' => (int) $row->aggregate,
            ])
            ->sortByDesc('value')
            ->take($limit)
            ->values()
            ->all();
    }

    /**
     * Tickets created vs resolved, grouped by month, for the last N months.
     *
     * @return list<array{period: string, label: string, created: int, resolved: int}>
     */
    public function createdVsResolved(int $months = 6): array
    {
        $start = CarbonImmutable::now()->startOfMonth()->subMonths($months - 1);

        $created = $this->monthlyBuckets(
            Ticket::query()->where('created_at', '>=', $start)->pluck('created_at')
        );
        $resolved = $this->monthlyBuckets(
            Ticket::query()->whereNotNull('resolved_at')->where('resolved_at', '>=', $start)->pluck('resolved_at')
        );

        $series = [];
        for ($i = 0; $i < $months; $i++) {
            $month = $start->addMonths($i);
            $key = $month->format('Y-m');
            $series[] = [
                'period' => $key,
                'label' => $month->locale('es')->isoFormat('MMM YYYY'),
                'created' => (int) ($created[$key] ?? 0),
                'resolved' => (int) ($resolved[$key] ?? 0),
            ];
        }

        return $series;
    }

    public function averageResolutionHours(?Carbon $from = null, ?Carbon $to = null): ?float
    {
        $durations = $this->baseQuery($from, $to)
            ->whereNotNull('resolved_at')
            ->get(['created_at', 'resolved_at'])
            ->map(fn (Ticket $ticket) => $ticket->created_at->diffInMinutes($ticket->resolved_at));

        if ($durations->isEmpty()) {
            return null;
        }

        return round($durations->avg() / 60, 1);
    }

    /**
     * @param  Collection<int, Carbon>  $dates
     * @return array<string, int>
     */
    private function monthlyBuckets(Collection $dates): array
    {
        return $dates
            ->groupBy(fn (Carbon $date) => $date->format('Y-m'))
            ->map->count()
            ->all();
    }

    private function baseQuery(?Carbon $from, ?Carbon $to): Builder
    {
        return Ticket::query()
            ->when($from, fn ($q) => $q->where('created_at', '>=', $from))
            ->when($to, fn ($q) => $q->where('created_at', '<=', $to));
    }
}
