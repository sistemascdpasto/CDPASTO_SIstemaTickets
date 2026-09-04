import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';

const offsets: Record<Direction, { x?: number; y?: number }> = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
};

/**
 * React Bits — AnimatedContent.
 * Reveals its children (slide + fade, optional scale) when scrolled into view.
 */
export function AnimatedContent({
    children,
    className,
    direction = 'up',
    distance,
    delay = 0,
    duration = 0.7,
    scale = 1,
    once = true,
}: {
    children: React.ReactNode;
    className?: string;
    direction?: Direction;
    distance?: number;
    delay?: number;
    duration?: number;
    scale?: number;
    once?: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once, amount: 0.2 });
    const base = offsets[direction];
    const from = distance != null ? { x: base.x ? Math.sign(base.x) * distance : 0, y: base.y ? Math.sign(base.y) * distance : 0 } : base;

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, scale, ...from }}
            animate={inView ? { opacity: 1, scale: 1, x: 0, y: 0 } : {}}
            transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}
