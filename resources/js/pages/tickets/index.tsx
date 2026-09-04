import { PriorityBadge, StatusBadge, TypeBadge } from '@/components/tickets/badges';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/tickets';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Paginated, type Ticket, type TicketStatus } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Mis tickets', href: '/tickets' }];

interface Props {
    tickets: Paginated<Ticket>;
    statuses: { data: TicketStatus[] };
    filters: { status?: string; search?: string };
}

export default function TicketsIndex({ tickets, statuses, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((filters.search ?? '') === search) return;
            router.get('/tickets', { ...filters, search: search || undefined }, { preserveState: true, replace: true });
        }, 350);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    function setStatus(value: string) {
        router.get('/tickets', { ...filters, status: value || undefined }, { preserveState: true, replace: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis tickets" />

            <div className="space-y-5 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Mis tickets</h1>
                        <p className="text-sm text-muted-foreground">Todas las solicitudes que has registrado.</p>
                    </div>
                    <Button asChild>
                        <Link href="/tickets/create">
                            <PlusCircle className="size-4" /> Nuevo ticket
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por título, número o descripción…"
                            className="pl-9"
                        />
                    </div>
                    <NativeSelect
                        value={filters.status ?? ''}
                        onChange={(e) => setStatus(e.target.value)}
                        className="sm:w-56"
                    >
                        <option value="">Todos los estados</option>
                        {statuses.data.map((status) => (
                            <option key={status.id} value={status.slug}>
                                {status.name}
                            </option>
                        ))}
                    </NativeSelect>
                </div>

                <Card className="overflow-hidden p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ticket</TableHead>
                                <TableHead className="hidden md:table-cell">Software</TableHead>
                                <TableHead className="hidden lg:table-cell">Tipo</TableHead>
                                <TableHead>Prioridad</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="hidden sm:table-cell">Creado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                                        No se encontraron tickets.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickets.data.map((ticket) => (
                                    <TableRow
                                        key={ticket.id}
                                        className="cursor-pointer"
                                        onClick={() => router.visit(`/tickets/${ticket.id}`)}
                                    >
                                        <TableCell>
                                            <p className="font-medium">{ticket.title}</p>
                                            <p className="text-xs text-muted-foreground">{ticket.reference}</p>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                            {ticket.software.name}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <TypeBadge type={ticket.type} />
                                        </TableCell>
                                        <TableCell>
                                            <PriorityBadge priority={ticket.priority} />
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={ticket.status} />
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                                            {formatDate(ticket.created_at)}
                                        </TableCell>
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
