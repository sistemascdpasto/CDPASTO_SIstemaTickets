import { StatusBadge, PriorityBadge } from '@/components/tickets/badges';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/tickets';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Ticket } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Inbox, PlusCircle, Ticket as TicketIcon, XCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Panel', href: '/dashboard' }];

interface StatusCount {
    slug: string;
    name: string;
    color: string;
    count: number;
}

interface Props {
    summary: {
        total: number;
        open: number;
        resolved: number;
        closed: number;
        by_status: StatusCount[];
    };
    recent: { data: Ticket[] };
}

export default function Dashboard({ summary, recent }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Mi panel de soporte</h1>
                        <p className="text-sm text-muted-foreground">Resumen de tus solicitudes registradas.</p>
                    </div>
                    <Button asChild>
                        <Link href="/tickets/create">
                            <PlusCircle className="size-4" /> Nuevo ticket
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Total" value={summary.total} icon={TicketIcon} />
                    <StatCard label="Abiertos" value={summary.open} icon={Inbox} tone="amber" />
                    <StatCard label="Resueltos" value={summary.resolved} icon={CheckCircle2} tone="green" />
                    <StatCard label="Cerrados" value={summary.closed} icon={XCircle} tone="blue" />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold">Tickets recientes</CardTitle>
                            <Link href="/tickets" className="text-sm text-primary hover:underline">
                                Ver todos
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {recent.data.length === 0 ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    Aún no has creado ningún ticket.
                                </p>
                            ) : (
                                recent.data.map((ticket) => (
                                    <Link
                                        key={ticket.id}
                                        href={`/tickets/${ticket.id}`}
                                        className="flex items-center gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-accent"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{ticket.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {ticket.reference} · {ticket.software.name} · {formatDate(ticket.created_at)}
                                            </p>
                                        </div>
                                        <PriorityBadge priority={ticket.priority} />
                                        <StatusBadge status={ticket.status} />
                                    </Link>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Por estado</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {summary.by_status.map((status) => (
                                <div key={status.slug} className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{status.name}</span>
                                    <span className="font-semibold">{status.count}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
