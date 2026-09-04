import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

interface ParticlesProps {
    className?: string;
    quantity?: number;
    colors?: string[];
    minSize?: number;
    maxSize?: number;
    speed?: number;
    /** How far the cursor pushes nearby particles. */
    hoverRadius?: number;
}

interface P {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    twinkle: number;
}

/**
 * React Bits — Particles (canvas variant).
 * A drifting, twinkling particle field that gently repels from the cursor.
 * Pure canvas, no WebGL. Respects prefers-reduced-motion.
 */
export function Particles({
    className,
    quantity = 90,
    colors = ['#e0951a', '#f5c451', '#c73a3a', '#ffffff'],
    minSize = 0.6,
    maxSize = 2.4,
    speed = 0.35,
    hoverRadius = 130,
}: ParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: -9999, y: -9999 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let raf = 0;
        let particles: P[] = [];
        let w = 0;
        let h = 0;

        const resize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            w = rect?.width ?? window.innerWidth;
            h = rect?.height ?? window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            build();
        };

        const build = () => {
            const count = Math.round((quantity * Math.min(w, 1400)) / 1400) || quantity;
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                size: minSize + Math.random() * (maxSize - minSize),
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 0.2 + Math.random() * 0.6,
                twinkle: Math.random() * Math.PI * 2,
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.twinkle += 0.02;

                if (p.x < -10) p.x = w + 10;
                if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10;
                if (p.y > h + 10) p.y = -10;

                const dx = p.x - mouse.current.x;
                const dy = p.y - mouse.current.y;
                const dist = Math.hypot(dx, dy);
                if (dist < hoverRadius) {
                    const force = (1 - dist / hoverRadius) * 2.5;
                    p.x += (dx / (dist || 1)) * force;
                    p.y += (dy / (dist || 1)) * force;
                }

                const a = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));
                ctx.globalAlpha = a;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            raf = requestAnimationFrame(draw);
        };

        const onMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        const onLeave = () => {
            mouse.current = { x: -9999, y: -9999 };
        };

        resize();
        if (reduce) {
            draw();
            cancelAnimationFrame(raf);
            // one static frame
        } else {
            raf = requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseout', onLeave);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseout', onLeave);
        };
    }, [quantity, colors, minSize, maxSize, speed, hoverRadius]);

    return <canvas ref={canvasRef} aria-hidden className={cn('pointer-events-none absolute inset-0 h-full w-full', className)} />;
}
