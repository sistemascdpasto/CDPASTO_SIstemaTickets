import { useEffect, useRef } from 'react';

interface Spark {
    x: number;
    y: number;
    angle: number;
    start: number;
}

/**
 * React Bits — ClickSpark.
 * Bursts a ring of short spark lines from every click inside the wrapper.
 */
export function ClickSpark({
    children,
    sparkColor = '#e0951a',
    sparkCount = 9,
    sparkRadius = 18,
    duration = 420,
}: {
    children: React.ReactNode;
    sparkColor?: string;
    sparkCount?: number;
    sparkRadius?: number;
    duration?: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sparks = useRef<Spark[]>([]);
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        if (!canvas || !wrap) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const resize = () => {
            canvas.width = wrap.clientWidth * dpr;
            canvas.height = wrap.clientHeight * dpr;
            canvas.style.width = `${wrap.clientWidth}px`;
            canvas.style.height = `${wrap.clientHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();

        let raf = 0;
        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const now = performance.now();
            sparks.current = sparks.current.filter((s) => now - s.start < duration);
            for (const s of sparks.current) {
                const t = (now - s.start) / duration;
                const eased = 1 - Math.pow(1 - t, 3);
                const d = eased * sparkRadius;
                const len = (1 - t) * 8 + 2;
                ctx.strokeStyle = sparkColor;
                ctx.globalAlpha = 1 - t;
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(s.x + Math.cos(s.angle) * d, s.y + Math.sin(s.angle) * d);
                ctx.lineTo(s.x + Math.cos(s.angle) * (d + len), s.y + Math.sin(s.angle) * (d + len));
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        const onClick = (e: MouseEvent) => {
            const rect = wrap.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const now = performance.now();
            for (let i = 0; i < sparkCount; i++) {
                sparks.current.push({ x, y, angle: (i / sparkCount) * Math.PI * 2, start: now });
            }
        };

        wrap.addEventListener('click', onClick);
        window.addEventListener('resize', resize);
        return () => {
            cancelAnimationFrame(raf);
            wrap.removeEventListener('click', onClick);
            window.removeEventListener('resize', resize);
        };
    }, [sparkColor, sparkCount, sparkRadius, duration]);

    return (
        <div ref={wrapRef} className="relative">
            {children}
            <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-50 h-full w-full" />
        </div>
    );
}
