import { useCallback, useRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * React Bits — MagicBento (card).
 * A radial spotlight + a glowing conic border track the cursor across each card;
 * the card lifts slightly and casts a coloured shadow on hover.
 */
export function BentoCard({
    children,
    className,
    glow = 'rgba(224, 149, 26, 0.9)',
    spotlight = 'rgba(224, 149, 26, 0.18)',
}: {
    children: React.ReactNode;
    className?: string;
    glow?: string;
    spotlight?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--x', `${px}%`);
        el.style.setProperty('--y', `${py}%`);
        el.style.setProperty('--active', '1');
    }, []);

    const onLeave = useCallback(() => {
        ref.current?.style.setProperty('--active', '0');
    }, []);

    return (
        <div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={cn(
                'group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-[transform,box-shadow] duration-300',
                'hover:-translate-y-1',
                className,
            )}
            style={
                {
                    '--x': '50%',
                    '--y': '50%',
                    '--active': '0',
                    '--glow': glow,
                    '--spot': spotlight,
                    boxShadow: 'var(--rb-shadow, none)',
                } as React.CSSProperties
            }
        >
            {/* glowing border */}
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-[calc(var(--active))] transition-opacity duration-300"
                style={{
                    padding: '1px',
                    background:
                        'radial-gradient(280px circle at var(--x) var(--y), var(--glow), transparent 60%)',
                    WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />
            {/* spotlight fill */}
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-[calc(var(--active))] transition-opacity duration-300"
                style={{ background: 'radial-gradient(320px circle at var(--x) var(--y), var(--spot), transparent 55%)' }}
            />
            <div className="relative">{children}</div>
        </div>
    );
}
