import { AttachmentList } from '@/components/tickets/attachment-list';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { formatDateTime } from '@/lib/tickets';
import { cn } from '@/lib/utils';
import type { TicketComment } from '@/types';
import { useForm } from '@inertiajs/react';
import { Lock, Paperclip, Send } from 'lucide-react';
import { useRef } from 'react';

interface Props {
    comments: TicketComment[];
    postUrl: string;
    canComment: boolean;
    allowInternal?: boolean;
}

export function TicketConversation({ comments, postUrl, canComment, allowInternal = false }: Props) {
    const fileInput = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors, reset } = useForm<{
        body: string;
        is_internal: boolean;
        attachments: File[];
    }>({
        body: '',
        is_internal: false,
        attachments: [],
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(postUrl, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset();
                if (fileInput.current) fileInput.current.value = '';
            },
        });
    }

    return (
        <div className="space-y-4">
            {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aún no hay respuestas ni observaciones.</p>
            ) : (
                <ul className="space-y-4">
                    {comments.map((comment) => (
                        <li
                            key={comment.id}
                            className={cn(
                                'rounded-lg border p-4',
                                comment.is_internal
                                    ? 'border-amber-300 bg-amber-50 dark:border-amber-400/30 dark:bg-amber-400/5'
                                    : 'border-border bg-card',
                            )}
                        >
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                                <span className="font-medium">{comment.author?.name ?? 'Sistema'}</span>
                                {comment.is_internal && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-400/20 dark:text-amber-200">
                                        <Lock className="size-3" /> Nota interna
                                    </span>
                                )}
                                <time className="ml-auto text-xs text-muted-foreground">{formatDateTime(comment.created_at)}</time>
                            </div>
                            <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">{comment.body}</p>
                            <AttachmentList attachments={comment.attachments} compact />
                        </li>
                    ))}
                </ul>
            )}

            {canComment && (
                <form onSubmit={submit} className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                    <Textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        placeholder="Escribe una respuesta u observación…"
                        rows={3}
                    />
                    <InputError message={errors.body} />

                    <div className="flex flex-wrap items-center gap-3">
                        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                            <Paperclip className="size-4" />
                            <span>Adjuntar</span>
                            <input
                                ref={fileInput}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => setData('attachments', Array.from(e.target.files ?? []))}
                            />
                        </label>
                        {data.attachments.length > 0 && (
                            <span className="text-xs text-muted-foreground">{data.attachments.length} archivo(s)</span>
                        )}

                        {allowInternal && (
                            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                                <Checkbox
                                    checked={data.is_internal}
                                    onCheckedChange={(v) => setData('is_internal', v === true)}
                                />
                                Nota interna (no visible para el solicitante)
                            </label>
                        )}

                        <Button type="submit" size="sm" disabled={processing} className="ml-auto">
                            <Send className="size-4" /> Enviar
                        </Button>
                    </div>
                    <InputError message={errors['attachments.0' as keyof typeof errors] as string} />
                </form>
            )}
        </div>
    );
}
