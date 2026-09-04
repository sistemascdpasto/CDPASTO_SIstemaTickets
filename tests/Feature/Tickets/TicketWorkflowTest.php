<?php

namespace Tests\Feature\Tickets;

use App\Models\Software;
use App\Models\Ticket;
use App\Models\TicketStatus;
use App\Models\User;
use Database\Seeders\TicketStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TicketStatusSeeder::class);
    }

    private function ticket(): Ticket
    {
        return Ticket::factory()->for(User::factory())->for(Software::factory())->create();
    }

    public function test_an_admin_changing_status_records_history_and_resolution_date(): void
    {
        $ticket = $this->ticket();
        $resolved = TicketStatus::where('slug', 'resuelto')->first();
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->patch(route('admin.tickets.status.update', $ticket), [
                'ticket_status_id' => $resolved->id,
                'note' => 'Corregido en la versión 2.4.1',
            ])
            ->assertRedirect();

        $ticket->refresh();
        $this->assertSame($resolved->id, $ticket->ticket_status_id);
        $this->assertNotNull($ticket->resolved_at);
        $this->assertDatabaseHas('ticket_activities', [
            'ticket_id' => $ticket->id,
            'action' => 'status_changed',
            'description' => 'Corregido en la versión 2.4.1',
        ]);
    }

    public function test_a_requester_cannot_change_status(): void
    {
        $owner = User::factory()->create();
        $ticket = Ticket::factory()->for($owner)->for(Software::factory())->create();
        $resolved = TicketStatus::where('slug', 'resuelto')->first();

        $this->actingAs($owner)
            ->patch(route('admin.tickets.status.update', $ticket), ['ticket_status_id' => $resolved->id])
            ->assertForbidden();
    }

    public function test_an_admin_can_assign_a_ticket(): void
    {
        $ticket = $this->ticket();
        $agent = User::factory()->admin()->create();

        $this->actingAs(User::factory()->admin()->create())
            ->patch(route('admin.tickets.assign', $ticket), ['assigned_to' => $agent->id])
            ->assertRedirect();

        $this->assertSame($agent->id, $ticket->fresh()->assigned_to);
        $this->assertDatabaseHas('ticket_activities', ['ticket_id' => $ticket->id, 'action' => 'assigned']);

        // Unassign with an explicit null (the payload the UI sends).
        $this->actingAs(User::factory()->admin()->create())
            ->patch(route('admin.tickets.assign', $ticket), ['assigned_to' => null])
            ->assertRedirect();

        $this->assertNull($ticket->fresh()->assigned_to);
        $this->assertDatabaseHas('ticket_activities', ['ticket_id' => $ticket->id, 'action' => 'unassigned']);
    }

    public function test_internal_notes_are_hidden_from_the_requester(): void
    {
        $owner = User::factory()->create();
        $ticket = Ticket::factory()->for($owner)->for(Software::factory())->create();
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post(route('admin.tickets.comments.store', $ticket), [
            'body' => 'Nota interna para el equipo',
            'is_internal' => true,
        ])->assertRedirect();

        $this->actingAs($owner)
            ->get(route('tickets.show', $ticket))
            ->assertInertia(fn ($page) => $page->has('ticket.data.comments', 0));

        $this->actingAs($admin)
            ->get(route('admin.tickets.show', $ticket))
            ->assertInertia(fn ($page) => $page->has('ticket.data.comments', 1));
    }

    public function test_a_requester_can_reply_on_their_ticket(): void
    {
        $owner = User::factory()->create();
        $ticket = Ticket::factory()->for($owner)->for(Software::factory())->create();

        $this->actingAs($owner)->post(route('tickets.comments.store', $ticket), [
            'body' => 'Adjunto más información',
            'is_internal' => true,
        ])->assertRedirect();

        $comment = $ticket->comments()->first();
        $this->assertFalse($comment->is_internal, 'Requester comments must never be internal.');
    }
}
