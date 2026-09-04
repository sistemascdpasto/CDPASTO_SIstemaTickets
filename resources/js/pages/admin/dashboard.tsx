import { CategoryDonutChart, TrendLineChart } from '@/components/charts';
import { PriorityBadge, StatusBadge } from '@/components/tickets/badges';
import { StatCard } from '@/components/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/tickets';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Ticket } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlarmClock, CalendarDays, Clock, Inbox, Layers, TriangleAlert } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Panel', href: '/admin/dashboard' }];

interface Category {
    key: string;
    label: string;
    value: number;
}

interface Indicators {
    total: number;
    by_status: { slug: string; name: string; color: string; count: number }[];
    high_priority: number;
    unassigned: number;
    created_today: number;
    created_week: number;
    created_month: number;
    resolved_month: number;
    average_resolution_hours: number | null;
}

interface Props {
    indicators: Indicators;
    trend: { label: string; created: number; resolved: number }[];
    byPriority: Category[];
    byType: Category[];
    attention: { data: Ticket[] };
}

export default function AdminDashboard({ indicators, trend, byPriority, byType, attention }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel administrativo" />

            <div className="space-y-6 p-4 md:p-6">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Panel de soporte</h1>
                    <p className="text-sm text-muted-foreground">Estado general de la mesa de ayuda.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Total de tickets" value={indicators.total} icon={Layers} />
                    <StatCard label="Alta prioridad abiertos" value={indicators.high_priority} icon={TriangleAlert} tone="red" />
                    <StatCard label="Sin asignar" value={indicators.unassigned} icon={Inbox} tone="amber" />
                    <StatCard
                        label="Tiempo prom. resolución"
                        value={indicators.average_resolution_hours != null ? `${indicators.average_resolution_hours} h` : '—'}
                        icon={Clock}
                        tone="blue"
                    />
                    <StatCard label="Creados hoy" value={indicators.created_today} icon={AlarmClock} />
                    <StatCard label="Creados esta semana" value={indicators.created_week} icon={CalendarDays} />
                    <StatCard label="Creados este mes" value={indicators.created_month} icon={CalendarDays} />
                    <StatCard label="Resueltos este mes" value={indicators.resolved_month} icon={Clock} tone="green" />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {indicators.by_status.map((status) => (
                        <Card key={status.slug} className="p-4">
                            <p className="text-sm text-muted-foreground">{status.name}</p>
                            <p className="mt-1 text-2xl font-semibold">{status.count}</p>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <TrendLineChart title="Creados vs. resueltos (6 meses)" data={trend} />
                    <CategoryDonutChart title="Tickets por prioridad" data={byPriority} />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold">Requieren atención</CardTitle>
                            <Link href="/admin/tickets" className="text-sm text-primary hover:underline">
                                Ver todos
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {attention.data.length === 0 ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">Todo al día 🎉</p>
                            ) : (
                                attention.data.map((ticket) => (
                                    <Link
                                        key={ticket.id}
                                        href={`/admin/tickets/${ticket.id}`}
                                        className="flex items-center gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-accent"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{ticket.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {ticket.reference} · {ticket.creator?.name} · {formatDate(ticket.created_at)}
                                            </p>
                                        </div>
                                        <PriorityBadge priority={ticket.priority} />
                                        <StatusBadge status={ticket.status} />
                                    </Link>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <CategoryDonutChart title="Tickets por tipo" data={byType} />
                </div>
            </div>
        </AppLayout>
    );
}
