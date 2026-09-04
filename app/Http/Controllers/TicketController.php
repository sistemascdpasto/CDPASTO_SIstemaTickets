<?php

namespace App\Http\Controllers;

use App\Actions\Tickets\CreateTicket;
use App\Enums\TicketPriority;
use App\Enums\TicketType;
use App\Http\Requests\Tickets\StoreTicketRequest;
use App\Http\Resources\SoftwareResource;
use App\Http\Resources\TicketResource;
use App\Http\Resources\TicketStatusResource;
use App\Models\Software;
use App\Models\Ticket;
use App\Models\TicketStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['status', 'search']);

        $tickets = Ticket::query()
            ->visibleTo($request->user())
            ->filter($filters)
            ->with(['status', 'software'])
            ->withCount('comments')
            ->sortByRequest($request->string('sort')->toString() ?: null, $request->string('direction')->toString() ?: null)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('tickets/index', [
            'tickets' => TicketResource::collection($tickets),
            'statuses' => TicketStatusResource::collection(TicketStatus::query()->ordered()->get()),
            'filters' => (object) $filters,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Ticket::class);

        return Inertia::render('tickets/create', [
            'softwares' => SoftwareResource::collection(Software::query()->active()->orderBy('name')->get()),
            'types' => TicketType::options(),
            'priorities' => TicketPriority::options(),
        ]);
    }

    public function store(StoreTicketRequest $request, CreateTicket $createTicket): RedirectResponse
    {
        $ticket = $createTicket->handle(
            $request->safe()->only(['software_id', 'type', 'priority', 'title', 'description']),
            $request->user(),
            $request->file('attachments', []),
        );

        return redirect()
            ->route('tickets.show', $ticket)
            ->with('success', "Ticket {$ticket->reference} creado correctamente.");
    }

    public function show(Request $request, Ticket $ticket): Response
    {
        Gate::authorize('view', $ticket);

        $user = $request->user();

        $ticket->load([
            'status',
            'software',
            'creator',
            'assignee',
            'comments' => fn ($query) => $query->visibleTo($user)->with(['author', 'attachments'])->oldest(),
            'activities' => fn ($query) => $query->with('author')->oldest(),
            'attachments' => fn ($query) => $query->whereNull('ticket_comment_id'),
        ]);

        return Inertia::render('tickets/show', [
            'ticket' => TicketResource::make($ticket),
            'can' => [
                'comment' => $user->can('comment', $ticket),
                'manage' => $user->isAdmin(),
            ],
        ]);
    }
}
