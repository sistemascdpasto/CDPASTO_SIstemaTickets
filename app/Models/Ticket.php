<?php

namespace App\Models;

use App\Enums\TicketPriority;
use App\Enums\TicketType;
use Database\Factories\TicketFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    /** @use HasFactory<TicketFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'assigned_to',
        'software_id',
        'ticket_status_id',
        'type',
        'priority',
        'title',
        'description',
        'first_responded_at',
        'resolved_at',
        'closed_at',
    ];

    /**
     * Columns the admin ticket list may be sorted by.
     *
     * @var list<string>
     */
    public const SORTABLE = ['reference', 'title', 'priority', 'created_at', 'updated_at'];

    protected function casts(): array
    {
        return [
            'type' => TicketType::class,
            'priority' => TicketPriority::class,
            'first_responded_at' => 'datetime',
            'resolved_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::created(function (Ticket $ticket) {
            if (blank($ticket->reference)) {
                $ticket->reference = 'TK-'.str_pad((string) $ticket->id, 6, '0', STR_PAD_LEFT);
                $ticket->saveQuietly();
            }
        });
    }

    /**
     * The requester who created the ticket. `creator()` is the domain-facing
     * alias used throughout the app; `user()` keeps the framework convention
     * for the `user_id` column.
     *
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * @return BelongsTo<Software, $this>
     */
    public function software(): BelongsTo
    {
        return $this->belongsTo(Software::class);
    }

    /**
     * @return BelongsTo<TicketStatus, $this>
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(TicketStatus::class, 'ticket_status_id');
    }

    /**
     * @return HasMany<TicketComment, $this>
     */
    public function comments(): HasMany
    {
        return $this->hasMany(TicketComment::class);
    }

    /**
     * @return HasMany<TicketActivity, $this>
     */
    public function activities(): HasMany
    {
        return $this->hasMany(TicketActivity::class);
    }

    /**
     * @return HasMany<TicketAttachment, $this>
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(TicketAttachment::class);
    }

    /**
     * Limit the query to tickets the given user is allowed to see.
     * Admins see everything; everyone else sees tickets they created or are assigned to.
     */
    #[Scope]
    protected function visibleTo(Builder $query, User $user): Builder
    {
        if ($user->isAdmin()) {
            return $query;
        }

        return $query->where(function (Builder $query) use ($user) {
            $query->where('user_id', $user->id)->orWhere('assigned_to', $user->id);
        });
    }

    /**
     * Apply the admin ticket list filters.
     *
     * @param  array<string, mixed>  $filters
     */
    #[Scope]
    protected function filter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['status'] ?? null, fn (Builder $q, $slug) => $q->whereHas('status', fn (Builder $s) => $s->where('slug', $slug)))
            ->when($filters['priority'] ?? null, fn (Builder $q, $priority) => $q->where('priority', $priority))
            ->when($filters['type'] ?? null, fn (Builder $q, $type) => $q->where('type', $type))
            ->when($filters['software'] ?? null, fn (Builder $q, $softwareId) => $q->where('software_id', $softwareId))
            ->when($filters['user'] ?? null, fn (Builder $q, $userId) => $q->where('user_id', $userId))
            ->when($filters['assigned_to'] ?? null, fn (Builder $q, $userId) => $q->where('assigned_to', $userId))
            ->when($filters['date_from'] ?? null, fn (Builder $q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($filters['date_to'] ?? null, fn (Builder $q, $date) => $q->whereDate('created_at', '<=', $date))
            ->when($filters['search'] ?? null, function (Builder $q, $search) {
                $term = '%'.$search.'%';
                $q->where(function (Builder $q) use ($term) {
                    $q->where('reference', 'like', $term)
                        ->orWhere('title', 'like', $term)
                        ->orWhere('description', 'like', $term);
                });
            });
    }

    #[Scope]
    protected function sortByRequest(Builder $query, ?string $sort, ?string $direction): Builder
    {
        $sort = in_array($sort, self::SORTABLE, true) ? $sort : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';

        return $query->orderBy($sort, $direction)->orderByDesc('id');
    }
}
