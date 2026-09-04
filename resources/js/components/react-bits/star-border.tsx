import { type ElementType } from 'react';

import { cn } from '@/lib/utils';

/**
 * React Bits — StarBorder.
 * An animated gradient "comet" travels around the element's border.
 */
export function StarBorder({
    children,
    className,
    color = '#f5c451',
    speed = 5,
    as,
    ...rest
}: {
    children: React.ReactNode;
    className?: string;
    color?: string;
    speed?: number;
    as?: ElementType;
    [key: string]: unknown;
}) {
    const Comp: ElementType = as ?? 'div';

    return (
        <Comp
            className={cn('rb-star relative inline-flex overflow-hidden rounded-xl p-[1.5px] no-underline', className)}
            style={{ ['--rb-star-color' as string]: color, ['--rb-star-speed' as string]: `${speed}s` }}
            {...rest}
        >
            <span
                aria-hidden
                className="rb-star-track absolute inset-[-150%]"
                style={{ background: 'conic-gradient(from 0deg, transparent 0 62%, var(--rb-star-color) 80%, transparent 92% 100%)' }}
            />
            <span className="relative z-10 inline-flex w-full items-center justify-center rounded-[calc(0.75rem-1.5px)] bg-primary text-primary-foreground transition-colors">
                {children}
            </span>
            <style>{`
                @keyframes rb-star-spin { to { transform: rotate(360deg); } }
                .rb-star-track { animation: rb-star-spin var(--rb-star-speed) linear infinite; }
                @media (prefers-reduced-motion: reduce) { .rb-star-track { animation: none; opacity: 0; } }
            `}</style>
        </Comp>
    );
}
