import { TicketDetail } from '@/components/tickets/ticket-detail';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Ticket, type TicketStatus, type UserSummary } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    ticket: { data: Ticket };
    statuses: { data: TicketStatus[] };
    agents: { data: UserSummary[] };
}

function AdminControls({ ticket, statuses, agents }: { ticket: Ticket; statuses: TicketStatus[]; agents: UserSummary[] }) {
    const statusForm = useForm({ ticket_status_id: String(ticket.status.id), note: '' });
    const [assigning, setAssigning] = useState(false);

    function submitStatus(e: React.FormEvent) {
        e.preventDefault();
        statusForm.patch(`/admin/tickets/${ticket.id}/status`, {
            preserveScroll: true,
            onSuccess: () => statusForm.setData('note', ''),
        });
    }

    function submitAssign(value: string) {
        setAssigning(true);
        router.patch(
            `/admin/tickets/${ticket.id}/assign`,
            { assigned_to: value === '' ? null : Number(value) },
            { preserveScroll: true, onFinish: () => setAssigning(false) },
        );
    }

    return (
        <Card className="border-primary/30">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Gestión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={submitStatus} className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <NativeSelect
                        id="status"
                        value={statusForm.data.ticket_status_id}
                        onChange={(e) => statusForm.setData('ticket_status_id', e.target.value)}
                    >
                        {statuses.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </NativeSelect>
                    <Textarea
                        rows={2}
                        placeholder="Observación asociada al cambio (opcional)"
                        value={statusForm.data.note}
                        onChange={(e) => statusForm.setData('note', e.target.value)}
                    />
                    <InputError message={statusForm.errors.ticket_status_id} />
                    <Button type="submit" size="sm" disabled={statusForm.processing} className="w-full">
                        Actualizar estado
                    </Button>
                </form>

                <div className="space-y-2 border-t border-border pt-4">
                    <Label htmlFor="assignee">Responsable</Label>
                    <NativeSelect
                        id="assignee"
                        value={ticket.assignee ? String(ticket.assignee.id) : ''}
                        onChange={(e) => submitAssign(e.target.value)}
                        disabled={assigning}
                    >
                        <option value="">Sin asignar</option>
                        {agents.map((a) => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                    </NativeSelect>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminTicketShow({ ticket, statuses, agents }: Props) {
    const t = ticket.data;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tickets', href: '/admin/tickets' },
        { title: t.reference, href: `/admin/tickets/${t.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t.reference} · ${t.title}`} />
            <div className="p-4 md:p-6">
                <TicketDetail
                    ticket={t}
                    commentUrl={`/admin/tickets/${t.id}/comments`}
                    canComment
                    allowInternal
                    sidebar={<AdminControls ticket={t} statuses={statuses.data} agents={agents.data} />}
                />
            </div>
        </AppLayout>
    );
}
