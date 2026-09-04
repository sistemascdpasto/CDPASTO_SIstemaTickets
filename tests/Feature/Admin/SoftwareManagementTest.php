<?php

namespace Tests\Feature\Admin;

use App\Models\Software;
use App\Models\Ticket;
use App\Models\User;
use Database\Seeders\TicketStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SoftwareManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TicketStatusSeeder::class);
    }

    public function test_an_admin_can_create_a_software(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->post(route('admin.softwares.store'), ['name' => 'Portal Clientes', 'is_active' => true])
            ->assertRedirect();

        $this->assertDatabaseHas('softwares', ['name' => 'Portal Clientes', 'slug' => 'portal-clientes']);
    }

    public function test_a_non_admin_cannot_manage_softwares(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('admin.softwares.store'), ['name' => 'X'])
            ->assertForbidden();
    }

    public function test_a_software_with_tickets_cannot_be_deleted(): void
    {
        $software = Software::factory()->create();
        Ticket::factory()->for(User::factory())->for($software)->create();

        $this->actingAs(User::factory()->admin()->create())
            ->delete(route('admin.softwares.destroy', $software))
            ->assertSessionHas('error');

        $this->assertDatabaseHas('softwares', ['id' => $software->id]);
    }
}
