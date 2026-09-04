import { PriorityBadge, StatusBadge, TypeBadge } from '@/components/tickets/badges';
import { AttachmentList } from '@/components/tickets/attachment-list';
import { TicketConversation } from '@/components/tickets/conversation';
import { TicketTimeline } from '@/components/tickets/timeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/tickets';
import type { Ticket } from '@/types';

interface Props {
    ticket: Ticket;
    commentUrl: string;
    canComment: boolean;
    allowInternal?: boolean;
    sidebar?: React.ReactNode;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 py-2 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium">{children}</span>
        </div>
    );
}

export function TicketDetail({ ticket, commentUrl, canComment, allowInternal = false, sidebar }: Props) {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="font-mono text-sm text-muted-foreground">{ticket.reference}</p>
                    <h1 className="text-xl font-semibold tracking-tight">{ticket.title}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                        <TypeBadge type={ticket.type} />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold">Descripción</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm text-foreground/90">{ticket.description}</p>
                            {ticket.attachments && ticket.attachments.length > 0 && (
                                <div className="mt-4">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Archivos adjuntos
                                    </p>
                                    <AttachmentList attachments={ticket.attachments} />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold">Respuestas y observaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TicketConversation
                                comments={ticket.comments ?? []}
                                postUrl={commentUrl}
                                canComment={canComment}
                                allowInternal={allowInternal}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {sidebar}

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold">Detalles</CardTitle>
                        </CardHeader>
                        <CardContent className="divide-y divide-border">
                            <Row label="Software">{ticket.software.name}</Row>
                            <Row label="Solicitante">{ticket.creator?.name ?? '—'}</Row>
                            <Row label="Responsable">{ticket.assignee?.name ?? 'Sin asignar'}</Row>
                            <Row label="Creado">{formatDate(ticket.created_at)}</Row>
                            <Row label="Actualizado">{formatDate(ticket.updated_at)}</Row>
                            <Row label="Resuelto">{ticket.resolved_at ? formatDate(ticket.resolved_at) : '—'}</Row>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold">Historial</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TicketTimeline activities={ticket.activities ?? []} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
