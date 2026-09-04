import { cn } from '@/lib/utils';

/**
 * React Bits — ScrollVelocity / LogoLoop style marquee.
 * An infinite horizontal scroll of items, pausing on hover.
 */
export function Marquee({
    items,
    className,
    speed = 26,
    reverse = false,
}: {
    items: React.ReactNode[];
    className?: string;
    speed?: number;
    reverse?: boolean;
}) {
    return (
        <div className={cn('group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]', className)}>
            {[0, 1].map((k) => (
                <div
                    key={k}
                    aria-hidden={k === 1}
                    className="flex shrink-0 items-center gap-10 pr-10 will-change-transform group-hover:[animation-play-state:paused]"
                    style={{
                        animation: `rb-marquee ${speed}s linear infinite`,
                        animationDirection: reverse ? 'reverse' : 'normal',
                    }}
                >
                    {items.map((item, i) => (
                        <span key={i} className="text-sm font-medium text-muted-foreground">
                            {item}
                        </span>
                    ))}
                </div>
            ))}
            <style>{`
                @keyframes rb-marquee { to { transform: translateX(-100%); } }
                @media (prefers-reduced-motion: reduce) { [style*="rb-marquee"] { animation: none !important; } }
            `}</style>
        </div>
    );
}
