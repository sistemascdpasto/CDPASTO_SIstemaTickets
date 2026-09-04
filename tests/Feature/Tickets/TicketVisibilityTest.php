<?php

namespace Tests\Feature\Tickets;

use App\Models\Software;
use App\Models\Ticket;
use App\Models\User;
use Database\Seeders\TicketStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketVisibilityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TicketStatusSeeder::class);
    }

    private function ticketFor(User $user): Ticket
    {
        return Ticket::factory()->for($user)->for(Software::factory())->create();
    }

    public function test_a_user_only_sees_their_own_tickets_in_the_list(): void
    {
        $user = User::factory()->create();
        $this->ticketFor($user);
        $this->ticketFor(User::factory()->create());

        $this->actingAs($user)
            ->get(route('tickets.index'))
            ->assertInertia(fn ($page) => $page->component('tickets/index')->has('tickets.data', 1));
    }

    public function test_a_user_cannot_view_someone_elses_ticket(): void
    {
        $other = $this->ticketFor(User::factory()->create());

        $this->actingAs(User::factory()->create())
            ->get(route('tickets.show', $other))
            ->assertForbidden();
    }

    public function test_an_admin_can_view_any_ticket(): void
    {
        $ticket = $this->ticketFor(User::factory()->create());

        $this->actingAs(User::factory()->admin()->create())
            ->get(route('admin.tickets.show', $ticket))
            ->assertOk();
    }

    public function test_non_admins_cannot_reach_the_admin_area(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('admin.dashboard'))
            ->assertForbidden();
    }

    public function test_admins_are_redirected_out_of_the_requester_area(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->get(route('dashboard'))->assertRedirect(route('admin.dashboard'));
        $this->actingAs($admin)->get(route('tickets.index'))->assertRedirect(route('admin.dashboard'));
        $this->actingAs($admin)->get(route('tickets.create'))->assertRedirect(route('admin.dashboard'));
    }

    public function test_admins_cannot_create_tickets(): void
    {
        $admin = User::factory()->admin()->create();

        // Route middleware redirects the GET; the policy also forbids the action.
        $this->assertFalse($admin->can('create', Ticket::class));
    }

    public function test_login_sends_admins_to_their_panel(): void
    {
        $admin = User::factory()->admin()->create();

        $this->post(route('login'), ['identification' => $admin->identification, 'password' => 'password'])
            ->assertRedirect(route('admin.dashboard', absolute: false));
    }
}
