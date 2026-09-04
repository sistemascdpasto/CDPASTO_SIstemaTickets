<?php

namespace App\Http\Controllers;

use App\Actions\Tickets\AddTicketComment;
use App\Http\Requests\Tickets\StoreTicketCommentRequest;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;

class TicketCommentController extends Controller
{
    public function store(StoreTicketCommentRequest $request, Ticket $ticket, AddTicketComment $addComment): RedirectResponse
    {
        $addComment->handle(
            $ticket,
            $request->user(),
            $request->validated('body'),
            $request->boolean('is_internal'),
            $request->file('attachments', []),
        );

        return back()->with('success', 'Comentario agregado.');
    }
}
