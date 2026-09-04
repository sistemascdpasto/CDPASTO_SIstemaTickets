import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef, useState } from 'react';

import { cn } from '@/lib/utils';

/**
 * React Bits — TiltedCard.
 * The card tilts in 3D toward the cursor and lifts a moving glare highlight.
 */
export function TiltedCard({
    children,
    className,
    max = 12,
    scale = 1.02,
}: {
    children: React.ReactNode;
    className?: string;
    max?: number;
    scale?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [hover, setHover] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), { stiffness: 200, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), { stiffness: 200, damping: 20 });
    const glare = useTransform(
        [x, y],
        ([gx, gy]: number[]) =>
            `radial-gradient(400px circle at ${(gx + 0.5) * 100}% ${(gy + 0.5) * 100}%, rgba(255,255,255,0.35), transparent 55%)`,
    );

    function onMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => {
                setHover(false);
                x.set(0);
                y.set(0);
            }}
            animate={{ scale: hover ? scale : 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 900 }}
            className={cn('relative', className)}
        >
            {children}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{ background: glare, opacity: hover ? 1 : 0, transition: 'opacity 0.25s' }}
            />
        </motion.div>
    );
}
