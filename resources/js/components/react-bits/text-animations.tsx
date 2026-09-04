import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

/**
 * React Bits — SplitText.
 * Characters spring up + fade in with a stagger, once in view.
 */
export function SplitText({
    text,
    className,
    delay = 0.03,
    duration = 0.5,
}: {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });
    const reduce = useReducedMotion();

    if (reduce) return <span className={cn('inline-block', className)}>{text}</span>;

    return (
        <span ref={ref} className={cn('inline-block', className)} aria-label={text} style={{ perspective: 600 }}>
            {text.split('').map((ch, i) => (
                <motion.span
                    key={i}
                    aria-hidden
                    className="inline-block will-change-transform"
                    initial={{ y: '0.6em', opacity: 0, rotateX: -45 }}
                    animate={inView ? { y: 0, opacity: 1, rotateX: 0 } : {}}
                    transition={{ duration, delay: i * delay, ease: [0.22, 1, 0.36, 1] }}
                >
                    {ch === ' ' ? ' ' : ch}
                </motion.span>
            ))}
        </span>
    );
}

/**
 * React Bits — BlurText.
 * Words un-blur and rise into place with a stagger, once in view.
 */
export function BlurText({ text, className, delay = 0.03 }: { text: string; className?: string; delay?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });
    const reduce = useReducedMotion();
    const words = text.split(' ');

    if (reduce) return <span className={cn('inline-block', className)}>{text}</span>;

    return (
        <span ref={ref} className={cn('inline-block', className)}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    className="inline-block will-change-[filter,transform]"
                    initial={{ filter: 'blur(8px)', opacity: 0, y: 8 }}
                    animate={inView ? { filter: 'blur(0px)', opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: Math.min(i * delay, 0.9), ease: 'easeOut' }}
                >
                    {word}
                    {i < words.length - 1 ? ' ' : ''}
                </motion.span>
            ))}
        </span>
    );
}

/**
 * React Bits — RotatingText.
 * Cycles through words with an animated vertical swap.
 */
export function RotatingText({ words, className, interval = 2400 }: { words: string[]; className?: string; interval?: number }) {
    const [index, setIndex] = useState(0);
    const widest = words.reduce((a, b) => (a.length >= b.length ? a : b));

    useEffect(() => {
        const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
        return () => clearInterval(id);
    }, [words.length, interval]);

    return (
        <span className={cn('relative inline-grid overflow-hidden text-left align-bottom', className)}>
            <span className="invisible col-start-1 row-start-1">{widest}</span>
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={index}
                    className="col-start-1 row-start-1 inline-block whitespace-nowrap"
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-110%', opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

/**
 * React Bits — ShinyText.
 * A highlight sweeps across the (fully visible) text on a loop.
 */
export function ShinyText({
    text,
    className,
    speed = 4,
    highlight = 'rgba(245, 196, 81, 0.95)',
}: {
    text: string;
    className?: string;
    speed?: number;
    highlight?: string;
}) {
    return (
        <span className={cn('relative inline-block', className)}>
            <span>{text}</span>
            <span
                aria-hidden
                className="rb-shiny absolute inset-0 bg-clip-text text-transparent"
                style={{
                    backgroundImage: `linear-gradient(110deg, transparent 42%, ${highlight} 50%, transparent 58%)`,
                    backgroundSize: '250% 100%',
                    animationDuration: `${speed}s`,
                }}
            >
                {text}
            </span>
            <style>{`
                @keyframes rb-shiny-move { from { background-position: 150% 0; } to { background-position: -150% 0; } }
                .rb-shiny { animation: rb-shiny-move linear infinite; }
                @media (prefers-reduced-motion: reduce) { .rb-shiny { animation: none; opacity: 0; } }
            `}</style>
        </span>
    );
}

/**
 * React Bits — GradientText. Animated multi-stop gradient clipped to text.
 */
export function GradientText({
    children,
    className,
    colors = ['#e0951a', '#c73a3a', '#f5c451', '#e0951a'],
    speed = 7,
}: {
    children: React.ReactNode;
    className?: string;
    colors?: string[];
    speed?: number;
}) {
    return (
        <span
            className={cn('rb-gradient bg-clip-text text-transparent', className)}
            style={{
                backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
                backgroundSize: '300% 100%',
                animationDuration: `${speed}s`,
            }}
        >
            {children}
            <style>{`
                @keyframes rb-gradient-move { to { background-position: 300% 0; } }
                .rb-gradient { animation: rb-gradient-move linear infinite; }
                @media (prefers-reduced-motion: reduce) { .rb-gradient { animation: none; } }
            `}</style>
        </span>
    );
}
