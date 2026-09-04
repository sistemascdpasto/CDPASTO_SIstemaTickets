<?php

namespace Tests\Feature\Admin;

use App\Models\Software;
use App\Models\Ticket;
use App\Models\TicketStatus;
use App\Models\User;
use App\Support\TicketStats;
use Database\Seeders\TicketStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TicketStatusSeeder::class);
    }

    public function test_the_dashboard_and_statistics_pages_render_for_admins(): void
    {
        $admin = User::factory()->admin()->create();
        Ticket::factory(5)->for(User::factory())->for(Software::factory())->create();

        $this->actingAs($admin)->get(route('admin.dashboard'))->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/dashboard')->has('indicators'));

        $this->actingAs($admin)->get(route('admin.statistics'))->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/statistics')->has('byStatus'));
    }

    public function test_indicators_are_calculated_from_real_data(): void
    {
        $pending = TicketStatus::where('slug', 'pendiente')->first();
        $resolved = TicketStatus::where('slug', 'resuelto')->first();

        Ticket::factory(3)->for(User::factory())->for(Software::factory())->create(['ticket_status_id' => $pending->id]);
        Ticket::factory(2)->for(User::factory())->for(Software::factory())->create([
            'ticket_status_id' => $resolved->id,
            'resolved_at' => now(),
        ]);

        $indicators = app(TicketStats::class)->indicators();

        $this->assertSame(5, $indicators['total']);
        $this->assertSame(2, $indicators['resolved_month']);
        $this->assertSame(3, collect($indicators['by_status'])->firstWhere('slug', 'pendiente')['count']);
    }
}
