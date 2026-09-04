import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    hint?: string;
    icon?: LucideIcon;
    tone?: 'default' | 'amber' | 'red' | 'green' | 'blue';
}

const toneRing: Record<NonNullable<StatCardProps['tone']>, string> = {
    default: 'text-muted-foreground bg-muted',
    amber: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-400/10',
    red: 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-400/10',
    green: 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-400/10',
    blue: 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-400/10',
};

export function StatCard({ label, value, hint, icon: Icon, tone = 'default' }: StatCardProps) {
    return (
        <Card className="flex items-start justify-between gap-3 p-4">
            <div className="min-w-0">
                <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
                {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
            </div>
            {Icon && (
                <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', toneRing[tone])}>
                    <Icon className="size-5" />
                </span>
            )}
        </Card>
    );
}
