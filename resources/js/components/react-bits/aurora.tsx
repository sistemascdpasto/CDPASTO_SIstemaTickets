import { cn } from '@/lib/utils';

/**
 * React Bits — Aurora (CSS variant).
 * Soft, slowly drifting aurora ribbons rendered with layered gradients + blur.
 * Zero dependencies. Colours default to the institutional amber/red palette.
 */
export function Aurora({
    className,
    colors = ['#e0951a', '#c73a3a', '#f5c451', '#2b7cb8'],
    blur = 60,
    opacity = 0.55,
}: {
    className?: string;
    colors?: string[];
    blur?: number;
    opacity?: number;
}) {
    const [a, b, c, d] = colors;

    return (
        <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
            <div
                className="rb-aurora absolute -inset-[35%]"
                style={{
                    opacity,
                    filter: `blur(${blur}px)`,
                    backgroundImage: `
                        radial-gradient(40% 55% at 20% 25%, ${a}cc 0%, transparent 60%),
                        radial-gradient(35% 45% at 78% 30%, ${b}bb 0%, transparent 60%),
                        radial-gradient(45% 50% at 65% 78%, ${c}cc 0%, transparent 62%),
                        radial-gradient(38% 48% at 30% 80%, ${d}99 0%, transparent 60%)
                    `,
                }}
            />
            <style>{`
                @keyframes rb-aurora-drift {
                    0%   { transform: translate3d(0,0,0) rotate(0deg) scale(1); }
                    33%  { transform: translate3d(3%, -4%, 0) rotate(4deg) scale(1.08); }
                    66%  { transform: translate3d(-3%, 3%, 0) rotate(-3deg) scale(1.04); }
                    100% { transform: translate3d(0,0,0) rotate(0deg) scale(1); }
                }
                .rb-aurora { animation: rb-aurora-drift 18s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) { .rb-aurora { animation: none; } }
            `}</style>
        </div>
    );
}
