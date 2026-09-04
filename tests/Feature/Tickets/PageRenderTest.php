<?php

namespace Tests\Feature\Tickets;

use App\Models\Software;
use App\Models\Ticket;
use App\Models\User;
use Database\Seeders\SoftwareSeeder;
use Database\Seeders\TicketStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageRenderTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([TicketStatusSeeder::class, SoftwareSeeder::class]);
    }

    public function test_key_pages_render(): void
    {
        $user = User::factory()->create();
        $admin = User::factory()->admin()->create();
        Ticket::factory(3)->for(User::factory())->for(Software::factory())->create();

        $this->actingAs($user)->get(route('tickets.create'))
            ->assertInertia(fn ($p) => $p->component('tickets/create')->has('softwares.data')->has('types')->has('priorities'));

        $this->actingAs($user)->get(route('dashboard'))
            ->assertInertia(fn ($p) => $p->component('dashboard')->has('summary')->has('recent.data'));

        $this->actingAs($admin)->get(route('admin.tickets.index'))
            ->assertInertia(fn ($p) => $p->component('admin/tickets/index')->has('tickets.data')->has('options.statuses.data'));

        $this->actingAs($admin)->get(route('admin.softwares.index'))
            ->assertInertia(fn ($p) => $p->component('admin/softwares/index')->has('softwares.data'));
    }

    public function test_ticket_detail_renders_with_an_attachment(): void
    {
        $owner = User::factory()->create();
        $ticket = Ticket::factory()->for($owner)->for(Software::factory())->create();
        $ticket->attachments()->create([
            'user_id' => $owner->id,
            'disk' => 'local',
            'path' => 'tickets/'.$ticket->id.'/evidencia.pdf',
            'original_name' => 'evidencia.pdf',
            'mime_type' => 'application/pdf',
            'size' => 12345,
        ]);

        $this->actingAs($owner)->get(route('tickets.show', $ticket))
            ->assertOk()
            ->assertInertia(fn ($p) => $p->has('ticket.data.attachments', 1));

        $this->actingAs(User::factory()->admin()->create())->get(route('admin.tickets.show', $ticket))
            ->assertOk();
    }

    public function test_filters_narrow_the_admin_list(): void
    {
        $admin = User::factory()->admin()->create();
        $target = Ticket::factory()->for(User::factory())->for(Software::factory())->create(['title' => 'Fallo crítico exportación']);
        Ticket::factory(4)->for(User::factory())->for(Software::factory())->create();

        $this->actingAs($admin)->get(route('admin.tickets.index', ['search' => 'exportación']))
            ->assertInertia(fn ($p) => $p->has('tickets.data', 1)
                ->where('tickets.data.0.reference', $target->reference));
    }
}
