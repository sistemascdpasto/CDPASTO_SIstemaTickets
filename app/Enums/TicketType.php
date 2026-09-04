<?php

namespace App\Enums;

enum TicketType: string
{
    case Bug = 'bug';
    case Support = 'support';
    case Improvement = 'improvement';
    case Request = 'request';
    case Question = 'question';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Bug => 'Error / Bug',
            self::Support => 'Soporte',
            self::Improvement => 'Mejora',
            self::Request => 'Solicitud',
            self::Question => 'Consulta',
            self::Other => 'Otro',
        };
    }

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $type) => ['value' => $type->value, 'label' => $type->label()],
            self::cases(),
        );
    }
}
