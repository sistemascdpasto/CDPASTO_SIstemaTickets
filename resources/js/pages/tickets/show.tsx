import { TicketDetail } from '@/components/tickets/ticket-detail';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Ticket } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    ticket: { data: Ticket };
    can: { comment: boolean; manage: boolean };
}

export default function TicketShow({ ticket, can }: Props) {
    const t = ticket.data;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Mis tickets', href: '/tickets' },
        { title: t.reference, href: `/tickets/${t.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t.reference} · ${t.title}`} />
            <div className="p-4 md:p-6">
                <TicketDetail ticket={t} commentUrl={`/tickets/${t.id}/comments`} canComment={can.comment} />
            </div>
        </AppLayout>
    );
}
