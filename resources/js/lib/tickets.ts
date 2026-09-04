import type { TicketActivity } from '@/types';

/**
 * Presentation metadata for ticket domain values. The backend sends raw
 * slugs/values; this is the single place the client turns them into colours
 * and labels so badges stay consistent across every screen.
 */

type Tone = 'slate' | 'blue' | 'amber' | 'green' | 'red' | 'zinc' | 'violet';

const toneClasses: Record<Tone, string> = {
    slate: 'bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-400/10 dark:text-slate-300 dark:ring-slate-400/20',
    blue: 'bg-blue-100 text-blue-700 ring-blue-700/20 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-400/20',
    amber: 'bg-amber-100 text-amber-800 ring-amber-700/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20',
    green: 'bg-emerald-100 text-emerald-700 ring-emerald-700/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20',
    red: 'bg-red-100 text-red-700 ring-red-700/20 dark:bg-red-400/10 dark:text-red-300 dark:ring-red-400/20',
    zinc: 'bg-zinc-200 text-zinc-700 ring-zinc-600/20 dark:bg-zinc-400/10 dark:text-zinc-300 dark:ring-zinc-400/20',
    violet: 'bg-violet-100 text-violet-700 ring-violet-700/20 dark:bg-violet-400/10 dark:text-violet-300 dark:ring-violet-400/20',
};

const toneDot: Record<Tone, string> = {
    slate: 'bg-slate-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    green: 'bg-emerald-500',
    red: 'bg-red-500',
    zinc: 'bg-zinc-500',
    violet: 'bg-violet-500',
};

export function badgeTone(color: string | null | undefined): string {
    return toneClasses[(color as Tone) in toneClasses ? (color as Tone) : 'slate'];
}

export function dotTone(color: string | null | undefined): string {
    return toneDot[(color as Tone) in toneDot ? (color as Tone) : 'slate'];
}

export const priorityTone: Record<string, Tone> = {
    low: 'slate',
    medium: 'blue',
    high: 'amber',
    urgent: 'red',
};

export const typeTone: Record<string, Tone> = {
    bug: 'red',
    support: 'blue',
    improvement: 'violet',
    request: 'amber',
    question: 'slate',
    other: 'zinc',
};

/** Recharts-friendly colours pulled from the institutional palette. */
export const chartColors = ['#e0951a', '#c73a3a', '#3a9b57', '#2b7cb8', '#9a6b3f', '#7c5cbf'];

export function formatDate(value: string | null | undefined): string {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(value: string | null | undefined): string {
    if (!value) return '—';
    return new Date(value).toLocaleString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function relativeTime(value: string): string {
    const diff = Date.now() - new Date(value).getTime();
    const minutes = Math.round(diff / 60000);
    if (minutes < 1) return 'hace un momento';
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.round(hours / 24);
    if (days < 30) return `hace ${days} d`;
    return formatDate(value);
}

export function activityLabel(activity: TicketActivity): string {
    const props = activity.properties ?? {};
    switch (activity.action) {
        case 'created':
            return 'creó el ticket';
        case 'status_changed': {
            const to = (props.to as { name?: string } | undefined)?.name;
            return to ? `cambió el estado a "${to}"` : 'actualizó el estado';
        }
        case 'assigned': {
            const to = (props.to as { name?: string } | undefined)?.name;
            return to ? `asignó el ticket a ${to}` : 'asignó el ticket';
        }
        case 'unassigned':
            return 'retiró la asignación';
        default:
            return activity.action;
    }
}
