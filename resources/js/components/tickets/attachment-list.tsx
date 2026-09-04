import type { TicketAttachment } from '@/types';
import { FileText, Paperclip } from 'lucide-react';

export function AttachmentList({ attachments, compact = false }: { attachments: TicketAttachment[]; compact?: boolean }) {
    if (attachments.length === 0) {
        return compact ? null : <p className="text-sm text-muted-foreground">Sin archivos adjuntos.</p>;
    }

    return (
        <ul className={compact ? 'mt-2 flex flex-wrap gap-2' : 'grid gap-2 sm:grid-cols-2'}>
            {attachments.map((file) => (
                <li key={file.id}>
                    <a
                        href={file.download_url}
                        className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:border-primary hover:bg-accent"
                    >
                        {compact ? <Paperclip className="size-3.5 shrink-0 text-muted-foreground" /> : <FileText className="size-4 shrink-0 text-muted-foreground" />}
                        <span className="truncate">{file.original_name}</span>
                        <span className="ml-auto shrink-0 text-xs text-muted-foreground">{file.human_size}</span>
                    </a>
                </li>
            ))}
        </ul>
    );
}
