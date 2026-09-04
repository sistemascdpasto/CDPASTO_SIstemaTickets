<?php

namespace Tests\Feature\Tickets;

use App\Models\Software;
use App\Models\Ticket;
use App\Models\User;
use Database\Seeders\TicketStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TicketCreationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TicketStatusSeeder::class);
    }

    public function test_a_user_can_create_a_ticket_with_attachments(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();
        $software = Software::factory()->create();

        $response = $this->actingAs($user)->post(route('tickets.store'), [
            'software_id' => $software->id,
            'type' => 'bug',
            'priority' => 'high',
            'title' => 'No puedo iniciar sesión',
            'description' => 'El sistema muestra un error 500 al iniciar sesión.',
            'attachments' => [UploadedFile::fake()->create('evidencia.pdf', 120, 'application/pdf')],
        ]);

        $ticket = Ticket::first();

        $response->assertredirect(route('tickets.show', $ticket));
        $this->assertSame($user->id, $ticket->user_id);
        $this->assertSame('TK-000001', $ticket->reference);
        $this->assertTrue($ticket->status->is_default);
        $this->assertCount(1, $ticket->attachments);
        $this->assertDatabaseHas('ticket_activities', ['ticket_id' => $ticket->id, 'action' => 'created']);
        Storage::disk('local')->assertExists($ticket->attachments->first()->path);
    }

    public function test_ticket_creation_is_validated(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('tickets.store'), [])
            ->assertSessionHasErrors(['software_id', 'type', 'priority', 'title', 'description']);
    }

    public function test_an_inactive_software_cannot_be_selected(): void
    {
        $user = User::factory()->create();
        $software = Software::factory()->inactive()->create();

        $this->actingAs($user)
            ->post(route('tickets.store'), [
                'software_id' => $software->id,
                'type' => 'support',
                'priority' => 'low',
                'title' => 'Consulta',
                'description' => 'Una consulta sobre el sistema.',
            ])
            ->assertSessionHasErrors('software_id');
    }
}
