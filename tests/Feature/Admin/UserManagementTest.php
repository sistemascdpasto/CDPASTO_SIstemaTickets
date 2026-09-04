<?php

namespace Tests\Feature\Admin;

use App\Models\Software;
use App\Models\Ticket;
use App\Models\User;
use Database\Seeders\TicketStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TicketStatusSeeder::class);
    }

    public function test_an_admin_creates_a_user_whose_id_number_is_the_initial_password(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post(route('admin.users.store'), [
            'name' => 'Juan Pérez',
            'identification' => '1085998877',
            'role' => 'user',
        ])->assertRedirect();

        $user = User::where('identification', '1085998877')->firstOrFail();
        $this->assertTrue(Hash::check('1085998877', $user->password));

        // And that user can log in with those credentials.
        $this->app['auth']->logout();
        $this->post(route('login'), ['identification' => '1085998877', 'password' => '1085998877'])
            ->assertRedirect(route('dashboard', absolute: false));
        $this->assertAuthenticatedAs($user);
    }

    public function test_identification_must_be_digits_and_unique(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->create(['identification' => '111222333']);

        $this->actingAs($admin)->post(route('admin.users.store'), [
            'name' => 'X', 'identification' => 'abc123', 'role' => 'user',
        ])->assertSessionHasErrors('identification');

        $this->actingAs($admin)->post(route('admin.users.store'), [
            'name' => 'X', 'identification' => '111222333', 'role' => 'user',
        ])->assertSessionHasErrors('identification');
    }

    public function test_non_admins_cannot_manage_users(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('admin.users.index'))
            ->assertForbidden();
    }

    public function test_an_admin_cannot_demote_or_deactivate_themselves(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->put(route('admin.users.update', $admin), [
            'name' => $admin->name,
            'identification' => $admin->identification,
            'role' => 'user',
            'is_active' => true,
        ])->assertSessionHasErrors('role');

        $this->actingAs($admin)->put(route('admin.users.update', $admin), [
            'name' => $admin->name,
            'identification' => $admin->identification,
            'role' => 'admin',
            'is_active' => false,
        ])->assertSessionHasErrors('is_active');
    }

    public function test_password_can_be_reset_to_the_identification_number(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create(['identification' => '5556667778', 'password' => Hash::make('something-else')]);

        $this->actingAs($admin)->put(route('admin.users.password', $user))->assertRedirect();

        $this->assertTrue(Hash::check('5556667778', $user->fresh()->password));
    }

    public function test_only_admins_can_be_assigned_as_responsible(): void
    {
        $admin = User::factory()->admin()->create();
        $ticket = Ticket::factory()->for(User::factory())->for(Software::factory())->create();
        $plainUser = User::factory()->create();

        $this->actingAs($admin)
            ->patch(route('admin.tickets.assign', $ticket), ['assigned_to' => $plainUser->id])
            ->assertSessionHasErrors('assigned_to');

        $this->actingAs($admin)
            ->patch(route('admin.tickets.assign', $ticket), ['assigned_to' => $admin->id])
            ->assertRedirect();
        $this->assertSame($admin->id, $ticket->fresh()->assigned_to);
    }
}
