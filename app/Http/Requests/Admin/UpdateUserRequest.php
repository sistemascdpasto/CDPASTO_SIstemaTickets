<?php

namespace App\Http\Requests\Admin;

class UpdateUserRequest extends StoreUserRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = parent::rules();
        $rules['is_active'] = ['required', 'boolean'];

        return $rules;
    }

    public function after(): array
    {
        return [
            function ($validator) {
                $user = $this->route('user');

                if ($user && $user->is($this->user())) {
                    if ($this->input('role') !== $user->role->value) {
                        $validator->errors()->add('role', 'No puedes cambiar tu propio rol.');
                    }
                    if (! $this->boolean('is_active')) {
                        $validator->errors()->add('is_active', 'No puedes desactivar tu propia cuenta.');
                    }
                }
            },
        ];
    }
}
