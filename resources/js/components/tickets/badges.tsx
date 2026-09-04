import { badgeTone, dotTone, priorityTone, typeTone } from '@/lib/tickets';
import { cn } from '@/lib/utils';
import type { Option, TicketStatus } from '@/types';

function Pill({ tone, children, withDot = false }: { tone: string | null | undefined; children: React.ReactNode; withDot?: boolean }) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap',
                badgeTone(tone),
            )}
        >
            {withDot && <span className={cn('size-1.5 rounded-full', dotTone(tone))} />}
            {children}
        </span>
    );
}

export function StatusBadge({ status }: { status: TicketStatus }) {
    return (
        <Pill tone={status.color} withDot>
            {status.name}
        </Pill>
    );
}

export function PriorityBadge({ priority }: { priority: Option }) {
    return <Pill tone={priorityTone[priority.value] ?? 'slate'}>{priority.label}</Pill>;
}

export function TypeBadge({ type }: { type: Option }) {
    return <Pill tone={typeTone[type.value] ?? 'zinc'}>{type.label}</Pill>;
}
