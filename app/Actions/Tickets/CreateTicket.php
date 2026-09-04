<?php

namespace App\Actions\Tickets;

use App\Models\Ticket;
use App\Models\TicketStatus;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class CreateTicket
{
    public function __construct(private readonly StoreTicketAttachments $attachments) {}

    /**
     * @param  array{software_id: int, type: string, priority: string, title: string, description: string}  $data
     * @param  array<int, UploadedFile>  $files
     */
    public function handle(array $data, User $creator, array $files = []): Ticket
    {
        return DB::transaction(function () use ($data, $creator, $files) {
            $status = TicketStatus::default();

            $ticket = $creator->tickets()->create([
                'software_id' => $data['software_id'],
                'ticket_status_id' => $status->id,
                'type' => $data['type'],
                'priority' => $data['priority'],
                'title' => $data['title'],
                'description' => $data['description'],
            ]);

            if ($files !== []) {
                $this->attachments->handle($ticket, $creator, $files);
            }

            $ticket->activities()->create([
                'user_id' => $creator->id,
                'action' => 'created',
                'description' => "Ticket creado con estado \"{$status->name}\".",
                'properties' => ['status' => $status->slug],
            ]);

            return $ticket;
        });
    }
}
