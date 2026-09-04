<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Tickets\AssignTicket;
use App\Actions\Tickets\ChangeTicketStatus;
use App\Enums\TicketPriority;
use App\Enums\TicketType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignTicketRequest;
use App\Http\Requests\Admin\UpdateTicketStatusRequest;
use App\Http\Resources\SoftwareResource;
use App\Http\Resources\TicketResource;
use App\Http\Resources\TicketStatusResource;
use App\Http\Resources\UserSummaryResource;
use App\Models\Software;
use App\Models\Ticket;
use App\Models\TicketStatus;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only([
            'status', 'priority', 'type', 'software', 'user', 'assigned_to', 'date_from', 'date_to', 'search',
        ]);

        $tickets = Ticket::query()
            ->filter($filters)
            ->with(['status', 'software', 'creator', 'assignee'])
            ->withCount(['comments', 'attachments'])
            ->sortByRequest(
                $request->string('sort')->toString() ?: null,
                $request->string('direction')->toString() ?: null,
            )
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/tickets/index', [
            'tickets' => TicketResource::collection($tickets),
            'filters' => (object) $filters,
            'sort' => [
                'column' => $request->string('sort')->toString() ?: 'created_at',
                'direction' => $request->string('direction')->toString() ?: 'desc',
            ],
            'options' => [
                'statuses' => TicketStatusResource::collection(TicketStatus::query()->ordered()->get()),
                'softwares' => SoftwareResource::collection(Software::query()->orderBy('name')->get()),
                'users' => UserSummaryResource::collection(User::query()->orderBy('name')->get(['id', 'name', 'email'])),
                'agents' => UserSummaryResource::collection(User::query()->admins()->orderBy('name')->get(['id', 'name', 'email'])),
                'types' => TicketType::options(),
                'priorities' => TicketPriority::options(),
            ],
        ]);
    }

    public function show(Ticket $ticket): Response
    {
        $ticket->load([
            'status',
            'software',
            'creator',
            'assignee',
            'comments' => fn ($query) => $query->with(['author', 'attachments'])->oldest(),
            'activities' => fn ($query) => $query->with('author')->oldest(),
            'attachments' => fn ($query) => $query->whereNull('ticket_comment_id'),
        ]);

        return Inertia::render('admin/tickets/show', [
            'ticket' => TicketResource::make($ticket),
            'statuses' => TicketStatusResource::collection(TicketStatus::query()->ordered()->get()),
            'agents' => UserSummaryResource::collection(User::query()->admins()->active()->orderBy('name')->get(['id', 'name', 'email'])),
        ]);
    }

    public function updateStatus(UpdateTicketStatusRequest $request, Ticket $ticket, ChangeTicketStatus $changeStatus): RedirectResponse
    {
        $status = TicketStatus::query()->findOrFail($request->integer('ticket_status_id'));

        $changeStatus->handle($ticket, $status, $request->user(), $request->input('note'));

        return back()->with('success', "Estado actualizado a \"{$status->name}\".");
    }

    public function assign(AssignTicketRequest $request, Ticket $ticket, AssignTicket $assignTicket): RedirectResponse
    {
        $assignee = $request->filled('assigned_to')
            ? User::query()->findOrFail($request->integer('assigned_to'))
            : null;

        $assignTicket->handle($ticket, $assignee, $request->user());

        return back()->with('success', $assignee ? "Ticket asignado a {$assignee->name}." : 'Asignación retirada.');
    }
}
