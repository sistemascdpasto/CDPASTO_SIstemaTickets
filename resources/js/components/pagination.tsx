import { cn } from '@/lib/utils';
import type { PaginationMeta } from '@/types';
import { Link } from '@inertiajs/react';

export function Pagination({ meta }: { meta?: PaginationMeta }) {
    if (!meta || meta.last_page <= 1) return null;

    return (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">
                Mostrando <span className="font-medium text-foreground">{meta.from ?? 0}</span>–
                <span className="font-medium text-foreground">{meta.to ?? 0}</span> de{' '}
                <span className="font-medium text-foreground">{meta.total}</span>
            </p>
            <nav className="flex flex-wrap items-center gap-1">
                {meta.links.map((link, i) => {
                    const label = link.label
                        .replace('&laquo; Previous', '‹')
                        .replace('Next &raquo;', '›')
                        .replace('pagination.previous', '‹')
                        .replace('pagination.next', '›');

                    if (!link.url) {
                        return (
                            <span key={i} className="px-3 py-1.5 text-sm text-muted-foreground/50" dangerouslySetInnerHTML={{ __html: label }} />
                        );
                    }

                    return (
                        <Link
                            key={i}
                            href={link.url}
                            preserveState
                            preserveScroll
                            className={cn(
                                'rounded-md px-3 py-1.5 text-sm transition-colors',
                                link.active
                                    ? 'bg-primary font-medium text-primary-foreground'
                                    : 'text-foreground hover:bg-accent',
                            )}
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                })}
            </nav>
        </div>
    );
}
