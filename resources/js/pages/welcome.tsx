import { AnimatedContent } from '@/components/react-bits/animated-content';
import { Aurora } from '@/components/react-bits/aurora';
import { ClickSpark } from '@/components/react-bits/click-spark';
import { CountUp } from '@/components/react-bits/count-up';
import { BentoCard } from '@/components/react-bits/magic-bento';
import { Magnet } from '@/components/react-bits/magnet';
import { Marquee } from '@/components/react-bits/marquee';
import { Particles } from '@/components/react-bits/particles';
import { StarBorder } from '@/components/react-bits/star-border';
import { BlurText, GradientText, RotatingText, ShinyText, SplitText } from '@/components/react-bits/text-animations';
import { TiltedCard } from '@/components/react-bits/tilted-card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ClipboardList,
    Clock,
    LineChart,
    MessagesSquare,
    Paperclip,
    ShieldCheck,
} from 'lucide-react';

const features = [
    { icon: ClipboardList, title: 'Registra tus solicitudes', text: 'Errores, soporte, mejoras o consultas sobre cualquier sistema de la empresa.', glow: 'rgba(224,149,26,0.9)', spot: 'rgba(224,149,26,0.18)' },
    { icon: Clock, title: 'Seguimiento en tiempo real', text: 'Consulta el estado, el historial completo y las respuestas de cada ticket.', glow: 'rgba(43,124,184,0.9)', spot: 'rgba(43,124,184,0.16)' },
    { icon: MessagesSquare, title: 'Comunicación directa', text: 'El equipo de soporte responde y deja observaciones dentro del mismo ticket.', glow: 'rgba(58,155,87,0.9)', spot: 'rgba(58,155,87,0.16)' },
    { icon: Paperclip, title: 'Adjunta evidencias', text: 'Sube capturas, documentos o archivos que ayuden a resolver más rápido.', glow: 'rgba(199,58,58,0.9)', spot: 'rgba(199,58,58,0.16)' },
    { icon: ShieldCheck, title: 'Atención priorizada', text: 'Cada caso se clasifica por prioridad y se asigna a un responsable.', glow: 'rgba(245,196,81,0.9)', spot: 'rgba(245,196,81,0.18)' },
    { icon: LineChart, title: 'Indicadores del servicio', text: 'Panel administrativo con métricas y estadísticas de la mesa de ayuda.', glow: 'rgba(124,92,191,0.9)', spot: 'rgba(124,92,191,0.16)' },
];

const steps = [
    { n: '01', title: 'Crea el ticket', text: 'Selecciona el sistema, el tipo de solicitud y describe lo que necesitas.', dir: 'up' as const },
    { n: '02', title: 'El equipo lo gestiona', text: 'Se asigna un responsable, cambia de estado y recibe observaciones.', dir: 'up' as const },
    { n: '03', title: 'Haz seguimiento', text: 'Ves cada avance en la línea de tiempo hasta que se resuelve.', dir: 'up' as const },
];

interface WelcomeProps {
    softwares: string[];
}

export default function Welcome({ softwares }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const panelHref = auth.user ? (auth.user.is_admin ? '/admin/dashboard' : '/dashboard') : route('login');
    const ctaHref = auth.user ? (auth.user.is_admin ? '/admin/dashboard' : '/tickets/create') : route('login');
    const ctaLabel = auth.user ? (auth.user.is_admin ? 'Ir al panel' : 'Crear un ticket') : 'Iniciar sesión';

    return (
        <ClickSpark sparkColor="#e0951a">
            <Head title="Mesa de Ayuda CD Nariño" />

            <div className="min-h-screen bg-background text-foreground">
                {/* Header */}
                <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-lg">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
                        <div className="flex items-center gap-3">
                            <img src="/image/CD NARIÑO.png" alt="CD Nariño" className="h-8 w-auto max-w-[120px] object-contain" />
                            <span className="text-sm font-semibold sm:text-base">Mesa de Ayuda</span>
                        </div>
                        <Magnet strength={0.25}>
                            <Link
                                href={panelHref}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                {auth.user ? 'Ir al panel' : 'Iniciar sesión'}
                                <ArrowRight className="size-4" />
                            </Link>
                        </Magnet>
                    </div>
                </header>

                {/* Hero */}
                <section className="relative overflow-hidden">
                    <Aurora className="opacity-80" />
                    <Particles quantity={110} className="opacity-80" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />

                    <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:grid-cols-[1.05fr_0.95fr] md:py-28">
                        <div>
                            <span className="inline-flex items-center rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium backdrop-blur">
                                <ShinyText text="Soporte técnico institucional · CD Nariño" />
                            </span>

                            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-[3.35rem]">
                                <SplitText text="Mesa de ayuda para" />
                                <span className="mt-1 block">
                                    <GradientText className="font-bold">los sistemas</GradientText> de la empresa
                                </span>
                            </h1>

                            <p className="mt-5 flex flex-wrap items-baseline gap-x-2 text-lg font-medium text-foreground/80">
                                Reporta
                                <RotatingText
                                    words={['errores', 'cambios', 'consultas', 'mejoras', 'incidencias']}
                                    className="font-semibold text-primary"
                                />
                                y haz seguimiento hasta resolver.
                            </p>

                            <BlurText
                                text="Centraliza reportes, solicitudes de cambio, consultas y soporte de todos los softwares desarrollados por CD Nariño en un solo lugar, con trazabilidad de principio a fin."
                                className="mt-4 max-w-xl text-sm text-muted-foreground"
                            />

                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <Magnet strength={0.3}>
                                    <StarBorder as={Link} href={ctaHref} className="text-sm font-semibold">
                                        <span className="flex items-center gap-2 px-5 py-3">
                                            {ctaLabel}
                                            <ArrowRight className="size-4" />
                                        </span>
                                    </StarBorder>
                                </Magnet>
                                <a
                                    href="#como-funciona"
                                    className="rounded-lg border border-input px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent"
                                >
                                    Cómo funciona
                                </a>
                            </div>

                            <AnimatedContent delay={0.3}>
                                <dl className="mt-12 grid max-w-md grid-cols-3 gap-4">
                                    {[
                                        { v: 6, s: '', l: 'Tipos de solicitud' },
                                        { v: 6, s: '', l: 'Estados de seguimiento' },
                                        { v: 100, s: '%', l: 'Trazabilidad' },
                                    ].map((stat) => (
                                        <div key={stat.l}>
                                            <dd className="text-3xl font-bold text-foreground">
                                                <CountUp end={stat.v} suffix={stat.s} />
                                            </dd>
                                            <dt className="mt-1 text-xs text-muted-foreground">{stat.l}</dt>
                                        </div>
                                    ))}
                                </dl>
                            </AnimatedContent>
                        </div>

                        <AnimatedContent direction="left" delay={0.15}>
                            <div className="relative">
                                <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-2xl" />
                                <TiltedCard className="[transform-style:preserve-3d]">
                                    <div className="rounded-2xl border border-border bg-white p-8 shadow-2xl">
                                        <img src="/image/CD NARIÑO.png" alt="CD Nariño" className="w-full object-contain" />
                                    </div>
                                </TiltedCard>
                            </div>
                        </AnimatedContent>
                    </div>

                    {/* Softwares marquee */}
                    {softwares.length > 0 && (
                        <div className="relative border-y border-border bg-background/60 py-4 backdrop-blur">
                            <Marquee
                                items={softwares.map((s) => (
                                    <span className="inline-flex items-center gap-2">
                                        <span className="size-1.5 rounded-full bg-primary/60" />
                                        {s}
                                    </span>
                                ))}
                            />
                        </div>
                    )}
                </section>

                {/* Features — MagicBento */}
                <section className="mx-auto max-w-6xl px-6 py-20">
                    <AnimatedContent>
                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Todo lo que necesitas para pedir soporte
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Una mesa de ayuda pensada para el trabajo diario, no un simple formulario.
                        </p>
                    </AnimatedContent>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, i) => (
                            <AnimatedContent key={feature.title} delay={i * 0.06}>
                                <BentoCard glow={feature.glow} spotlight={feature.spot} className="h-full">
                                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <feature.icon className="size-5" />
                                    </span>
                                    <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                                    <p className="mt-1.5 text-sm text-muted-foreground">{feature.text}</p>
                                </BentoCard>
                            </AnimatedContent>
                        ))}
                    </div>
                </section>

                {/* How it works */}
                <section id="como-funciona" className="border-y border-border bg-muted/30">
                    <div className="mx-auto max-w-6xl px-6 py-20">
                        <AnimatedContent>
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Cómo funciona</h2>
                        </AnimatedContent>
                        <div className="mt-10 grid gap-6 md:grid-cols-3">
                            {steps.map((step, i) => (
                                <AnimatedContent key={step.n} direction={i % 2 === 0 ? 'up' : 'down'} delay={i * 0.1}>
                                    <div className="relative h-full rounded-2xl border border-border bg-card p-6">
                                        <span className="font-mono text-4xl font-bold text-primary/25">{step.n}</span>
                                        <h3 className="mt-2 text-base font-semibold">{step.title}</h3>
                                        <p className="mt-1.5 text-sm text-muted-foreground">{step.text}</p>
                                    </div>
                                </AnimatedContent>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="mx-auto max-w-6xl px-6 py-24">
                    <AnimatedContent scale={0.96}>
                        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-12 text-center">
                            <Aurora className="opacity-45" blur={80} />
                            <Particles quantity={50} className="opacity-60" />
                            <div className="relative">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    <SplitText text="¿Necesitas reportar algo?" />
                                </h2>
                                <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
                                    Ingresa con tu número de identificación y registra tu solicitud en menos de un minuto.
                                </p>
                                <div className="mt-7 flex justify-center">
                                    <Magnet strength={0.3}>
                                        <StarBorder as={Link} href={panelHref} color="#e0951a">
                                            <span className="flex items-center gap-2 px-6 py-3 text-sm font-semibold">
                                                {auth.user ? 'Ir al panel' : 'Iniciar sesión'}
                                                <ArrowRight className="size-4" />
                                            </span>
                                        </StarBorder>
                                    </Magnet>
                                </div>
                            </div>
                        </div>
                    </AnimatedContent>
                </section>

                <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
                    CD Nariño · Mesa de Ayuda y Soporte Técnico
                </footer>
            </div>
        </ClickSpark>
    );
}
