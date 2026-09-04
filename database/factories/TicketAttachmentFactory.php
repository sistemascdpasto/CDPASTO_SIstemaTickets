<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\TicketAttachment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TicketAttachment>
 */
class TicketAttachmentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->word().'.pdf';

        return [
            'ticket_id' => Ticket::factory(),
            'ticket_comment_id' => null,
            'user_id' => User::factory(),
            'disk' => 'local',
            'path' => 'tickets/demo/'.$name,
            'original_name' => $name,
            'mime_type' => 'application/pdf',
            'size' => fake()->numberBetween(1024, 5_000_000),
        ];
    }
}
