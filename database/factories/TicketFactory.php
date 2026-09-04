<?php

namespace Database\Factories;

use App\Enums\TicketPriority;
use App\Enums\TicketType;
use App\Models\Software;
use App\Models\Ticket;
use App\Models\TicketStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $createdAt = fake()->dateTimeBetween('-4 months', 'now');

        return [
            'user_id' => User::factory(),
            'assigned_to' => null,
            'software_id' => Software::factory(),
            'ticket_status_id' => fn () => TicketStatus::query()->where('is_default', true)->value('id')
                ?? TicketStatus::factory(),
            'type' => fake()->randomElement(TicketType::cases()),
            'priority' => fake()->randomElement(TicketPriority::cases()),
            'title' => rtrim(fake()->sentence(6), '.'),
            'description' => fake()->paragraphs(2, true),
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ];
    }

    public function ofStatus(TicketStatus $status): static
    {
        return $this->state(function (array $attributes) use ($status) {
            $created = $attributes['created_at'] ?? now();
            $resolvedAt = $status->is_resolved || $status->is_terminal
                ? fake()->dateTimeBetween($created, 'now')
                : null;

            return [
                'ticket_status_id' => $status->id,
                'first_responded_at' => $status->slug === 'pendiente' ? null : fake()->dateTimeBetween($created, 'now'),
                'resolved_at' => $status->is_resolved ? $resolvedAt : null,
                'closed_at' => $status->is_terminal ? $resolvedAt : null,
            ];
        });
    }
}
