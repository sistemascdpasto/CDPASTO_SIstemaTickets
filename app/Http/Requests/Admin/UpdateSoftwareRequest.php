<?php

namespace App\Http\Requests\Admin;

use Illuminate\Validation\Rule;

class UpdateSoftwareRequest extends StoreSoftwareRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('software')) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            ...parent::rules(),
            'slug' => [
                'nullable', 'string', 'max:140', 'alpha_dash',
                Rule::unique('softwares', 'slug')->ignore($this->route('software')),
            ],
        ];
    }
}
