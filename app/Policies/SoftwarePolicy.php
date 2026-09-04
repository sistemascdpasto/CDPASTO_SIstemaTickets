<?php

namespace App\Policies;

use App\Models\Software;
use App\Models\User;

class SoftwarePolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isAdmin() ? true : false;
    }

    public function viewAny(User $user): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Software $software): bool
    {
        return false;
    }

    public function delete(User $user, Software $software): bool
    {
        return false;
    }
}
