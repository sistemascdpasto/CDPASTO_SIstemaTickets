<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['role', 'search', 'status']);

        $users = User::query()
            ->when($filters['role'] ?? null, fn ($q, $role) => $q->where('role', $role))
            ->when(($filters['status'] ?? null) === 'active', fn ($q) => $q->where('is_active', true))
            ->when(($filters['status'] ?? null) === 'inactive', fn ($q) => $q->where('is_active', false))
            ->when($filters['search'] ?? null, function ($q, $search) {
                $term = '%'.$search.'%';
                $q->where(fn ($q) => $q->where('name', 'like', $term)
                    ->orWhere('identification', 'like', $term)
                    ->orWhere('email', 'like', $term));
            })
            ->withCount(['tickets', 'assignedTickets'])
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => UserResource::collection($users),
            'filters' => (object) $filters,
            'roles' => UserRole::options(),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->safe()->only(['name', 'identification', 'email', 'role']);

        User::create([
            ...$data,
            'is_active' => $request->boolean('is_active', true),
            // The identification number doubles as the initial password.
            'password' => Hash::make($data['identification']),
            'email_verified_at' => now(),
        ]);

        return back()->with('success', 'Usuario creado. Su contraseña inicial es el número de identificación.');
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $user->update($request->safe()->only(['name', 'identification', 'email', 'role', 'is_active']));

        return back()->with('success', 'Usuario actualizado.');
    }

    public function resetPassword(User $user): RedirectResponse
    {
        $user->update(['password' => Hash::make($user->identification)]);

        return back()->with('success', "Contraseña de {$user->name} restablecida a su número de identificación.");
    }
}
