import { activityLabel, formatDateTime } from '@/lib/tickets';
import type { TicketActivity } from '@/types';
import { CircleDot, GitCommitHorizontal, UserPlus, UserMinus } from 'lucide-react';

const icons: Record<string, typeof CircleDot> = {
    created: CircleDot,
    status_changed: GitCommitHorizontal,
    assigned: UserPlus,
    unassigned: UserMinus,
};

export function TicketTimeline({ activities }: { activities: TicketActivity[] }) {
    if (activities.length === 0) {
        return <p className="text-sm text-muted-foreground">Sin movimientos registrados.</p>;
    }

    return (
        <ol className="relative space-y-5 border-l border-border pl-6">
            {activities.map((activity) => {
                const Icon = icons[activity.action] ?? CircleDot;
                return (
                    <li key={activity.id} className="relative">
                        <span className="absolute -left-[31px] flex size-5 items-center justify-center rounded-full bg-background ring-1 ring-border">
                            <Icon className="size-3 text-muted-foreground" />
                        </span>
                        <p className="text-sm">
                            <span className="font-medium">{activity.author?.name ?? 'Sistema'}</span>{' '}
                            <span className="text-muted-foreground">{activityLabel(activity)}</span>
                        </p>
                        {activity.description && activity.action === 'status_changed' && (
                            <p className="mt-1 rounded-md bg-muted px-3 py-2 text-sm text-foreground/80">{activity.description}</p>
                        )}
                        <time className="text-xs text-muted-foreground">{formatDateTime(activity.created_at)}</time>
                    </li>
                );
            })}
        </ol>
    );
}
