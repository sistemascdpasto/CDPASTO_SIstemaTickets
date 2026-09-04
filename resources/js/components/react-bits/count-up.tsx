import { animate, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

/**
 * React Bits — CountUp.
 * Eases from 0 → `end` the first time it scrolls into view.
 */
export function CountUp({
    end,
    duration = 1.6,
    prefix = '',
    suffix = '',
    className,
}: {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.5 });
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
            setValue(end);
            return;
        }
        const controls = animate(0, end, {
            duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (latest) => setValue(Math.round(latest)),
        });
        // Guarantee the final value even if the frame loop is throttled.
        const safety = window.setTimeout(() => setValue(end), duration * 1000 + 250);
        return () => {
            controls.stop();
            clearTimeout(safety);
        };
    }, [inView, end, duration]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            {value.toLocaleString('es-CO')}
            {suffix}
        </span>
    );
}
