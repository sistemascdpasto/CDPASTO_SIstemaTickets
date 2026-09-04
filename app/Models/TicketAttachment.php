<?php

namespace App\Models;

use Database\Factories\TicketAttachmentFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketAttachment extends Model
{
    /** @use HasFactory<TicketAttachmentFactory> */
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'ticket_comment_id',
        'user_id',
        'disk',
        'path',
        'original_name',
        'mime_type',
        'size',
    ];

    protected $appends = [
        'human_size',
        'download_url',
    ];

    protected function casts(): array
    {
        return [
            'size' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Ticket, $this>
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    /**
     * @return BelongsTo<TicketComment, $this>
     */
    public function comment(): BelongsTo
    {
        return $this->belongsTo(TicketComment::class, 'ticket_comment_id');
    }

    protected function humanSize(): Attribute
    {
        return Attribute::get(function () {
            $bytes = (int) $this->size;
            $units = ['B', 'KB', 'MB', 'GB', 'TB'];
            $power = $bytes > 0 ? (int) floor(log($bytes, 1024)) : 0;
            $power = min($power, count($units) - 1);
            $value = $bytes / (1024 ** $power);

            return ($power === 0 ? $value : round($value, 1)).' '.$units[$power];
        });
    }

    protected function downloadUrl(): Attribute
    {
        return Attribute::get(fn () => route('attachments.show', $this));
    }
}
