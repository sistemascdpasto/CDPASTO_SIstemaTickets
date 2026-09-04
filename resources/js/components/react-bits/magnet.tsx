import { motion, useMotionValue, useSpring } from 'motion/react';
import { useRef } from 'react';

/**
 * React Bits — Magnet.
 * The wrapped element is pulled toward the cursor while it hovers nearby.
 */
export function Magnet({
    children,
    className,
    strength = 0.35,
    radius = 120,
}: {
    children: React.ReactNode;
    className?: string;
    strength?: number;
    radius?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });
    const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });

    function onMove(e: React.MouseEvent<HTMLDivElement>) {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        if (Math.hypot(dx, dy) < radius + Math.max(rect.width, rect.height) / 2) {
            x.set(dx * strength);
            y.set(dy * strength);
        }
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{ x, y }}
            onMouseMove={onMove}
            onMouseLeave={() => {
                x.set(0);
                y.set(0);
            }}
        >
            {children}
        </motion.div>
    );
}
