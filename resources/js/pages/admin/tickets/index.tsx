import { Pagination } from '@/components/pagination';
import { PriorityBadge, StatusBadge, TypeBadge } from '@/components/tickets/badges';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/tickets';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Option, type Paginated, type Software, type Ticket, type TicketStatus, type UserSummary } from '@/types';
import { Head, router } from '@inertiajs/react';
import { RotateCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tickets', href: '/admin/tickets' }];

type Filters = {
    status?: string;
    priority?: string;
    type?: string;
    software?: string;
    user?: string;
    assigned_to?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
};

interface Props {
    tickets: Paginated<Ticket>;
    filters: Filters;
    sort: { column: string; direction: string };
    options: {
        statuses: { data: TicketStatus[] };
        softwares: { data: Software[] };
        users: { data: UserSummary[] };
        agents: { data: UserSummary[] };
        types: Option[];
        priorities: Option[];
    };
}

export default function AdminTicketsIndex({ tickets, filters, sort, options }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    function navigate(next: Partial<Filters & { sort: string; direction: string }>) {
        const params: Record<string, string | undefined> = { ...filters, ...sort, ...next };
        Object.keys(params).forEach((k) => {
            if (!params[k]) delete params[k];
        });
        router.get('/admin/tickets', params, { preserveState: true, replace: true });
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((filters.search ?? '') === search) return;
            navigate({ search: search || undefined });
        }, 350);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    function toggleSort(column: string) {
        const direction = sort.column === column && sort.direction === 'desc' ? 'asc' : 'desc';
        navigate({ sort: column, direction });
    }

    const hasFilters = Object.values(filters).some(Boolean);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de tickets" />

            <div className="space-y-5 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Gestión de tickets</h1>
                        <p className="text-sm text-muted-foreground">{tickets.meta?.total ?? 0} tickets registrados.</p>
                    </div>
                    {hasFilters && (
                        <Button variant="outline" size="sm" onClick={() => router.get('/admin/tickets')}>
                            <RotateCcw className="size-4" /> Limpiar filtros
                        </Button>
                    )}
                </div>

                <Card className="space-y-3 p-4">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por número, título o descripción…"
                            className="pl-9"
                        />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <NativeSelect value={filters.status ?? ''} onChange={(e) => navigate({ status: e.target.value || undefined })}>
                            <option value="">Estado: todos</option>
                            {options.statuses.data.map((s) => (
                                <option key={s.id} value={s.slug}>{s.name}</option>
                            ))}
                        </NativeSelect>
                        <NativeSelect value={filters.priority ?? ''} onChange={(e) => navigate({ priority: e.target.value || undefined })}>
                            <option value="">Prioridad: todas</option>
                            {options.priorities.map((p) => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </NativeSelect>
                        <NativeSelect value={filters.type ?? ''} onChange={(e) => navigate({ type: e.target.value || undefined })}>
                            <option value="">Tipo: todos</option>
                            {options.types.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </NativeSelect>
                        <NativeSelect value={filters.software ?? ''} onChange={(e) => navigate({ software: e.target.value || undefined })}>
                            <option value="">Software: todos</option>
                            {options.softwares.data.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </NativeSelect>
                        <NativeSelect value={filters.user ?? ''} onChange={(e) => navigate({ user: e.target.value || undefined })}>
                            <option value="">Solicitante: todos</option>
                            {options.users.data.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </NativeSelect>
                        <NativeSelect value={filters.assigned_to ?? ''} onChange={(e) => navigate({ assigned_to: e.target.value || undefined })}>
                            <option value="">Responsable: todos</option>
                            {options.agents.data.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </NativeSelect>
                        <Input type="date" value={filters.date_from ?? ''} onChange={(e) => navigate({ date_from: e.target.value || undefined })} />
                        <Input type="date" value={filters.date_to ?? ''} onChange={(e) => navigate({ date_to: e.target.value || undefined })} />
                    </div>
                </Card>

                <Card className="overflow-hidden p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="cursor-pointer" onClick={() => toggleSort('reference')}>Ticket</TableHead>
                                <TableHead className="hidden lg:table-cell">Solicitante</TableHead>
                                <TableHead className="hidden md:table-cell">Software</TableHead>
                                <TableHead className="hidden xl:table-cell">Tipo</TableHead>
                                <TableHead className="cursor-pointer" onClick={() => toggleSort('priority')}>Prioridad</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="hidden lg:table-cell">Responsable</TableHead>
                                <TableHead className="hidden sm:table-cell cursor-pointer" onClick={() => toggleSort('created_at')}>Creado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                                        No se encontraron tickets con esos criterios.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickets.data.map((ticket) => (
                                    <TableRow key={ticket.id} className="cursor-pointer" onClick={() => router.visit(`/admin/tickets/${ticket.id}`)}>
                                        <TableCell>
                                            <p className="font-medium">{ticket.title}</p>
                                            <p className="text-xs text-muted-foreground">{ticket.reference}</p>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{ticket.creator?.name}</TableCell>
                                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{ticket.software.name}</TableCell>
                                        <TableCell className="hidden xl:table-cell"><TypeBadge type={ticket.type} /></TableCell>
                                        <TableCell><PriorityBadge priority={ticket.priority} /></TableCell>
                                        <TableCell><StatusBadge status={ticket.status} /></TableCell>
                                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                            {ticket.assignee?.name ?? '—'}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{formatDate(ticket.created_at)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>

                <Pagination meta={tickets.meta} />
            </div>
        </AppLayout>
    );
}
