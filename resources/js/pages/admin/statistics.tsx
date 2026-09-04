import { CategoryBarChart, CategoryDonutChart, TrendLineChart } from '@/components/charts';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Estadísticas', href: '/admin/statistics' }];

interface Category {
    key: string;
    label: string;
    value: number;
}

interface Props {
    filters: { from: string | null; to: string | null; months: number };
    byStatus: Category[];
    byPriority: Category[];
    byType: Category[];
    bySoftware: Category[];
    byUser: Category[];
    trend: { label: string; created: number; resolved: number }[];
    averageResolutionHours: number | null;
}

export default function Statistics({ filters, byStatus, byPriority, byType, bySoftware, byUser, trend, averageResolutionHours }: Props) {
    const [form, setForm] = useState({
        from: filters.from ?? '',
        to: filters.to ?? '',
        months: String(filters.months),
    });

    function apply(e: React.FormEvent) {
        e.preventDefault();
        router.get('/admin/statistics', {
            from: form.from || undefined,
            to: form.to || undefined,
            months: form.months,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Estadísticas" />

            <div className="space-y-6 p-4 md:p-6">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Estadísticas</h1>
                    <p className="text-sm text-muted-foreground">Análisis de los tickets a partir de datos reales.</p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={apply} className="flex flex-wrap items-end gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="from">Desde</Label>
                                <Input id="from" type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="to">Hasta</Label>
                                <Input id="to" type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="months">Tendencia</Label>
                                <NativeSelect id="months" value={form.months} onChange={(e) => setForm({ ...form, months: e.target.value })}>
                                    <option value="3">3 meses</option>
                                    <option value="6">6 meses</option>
                                    <option value="12">12 meses</option>
                                </NativeSelect>
                            </div>
                            <Button type="submit">Aplicar</Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Tiempo promedio de resolución"
                        value={averageResolutionHours != null ? `${averageResolutionHours} h` : 'Sin datos'}
                        icon={Clock}
                        tone="blue"
                    />
                    <StatCard label="Total en el período" value={byStatus.reduce((s, d) => s + d.value, 0)} />
                    <StatCard label="Resueltos en el período" value={byStatus.filter((s) => ['resuelto', 'cerrado'].includes(s.key)).reduce((s, d) => s + d.value, 0)} tone="green" />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <TrendLineChart title="Creados vs. resueltos por período" data={trend} />
                    <CategoryDonutChart title="Tickets por estado" data={byStatus} />
                    <CategoryDonutChart title="Tickets por prioridad" data={byPriority} />
                    <CategoryBarChart title="Tickets por tipo de solicitud" data={byType} />
                    <CategoryBarChart title="Tickets por software" data={bySoftware} />
                    <CategoryBarChart title="Tickets por usuario (top 8)" data={byUser} />
                </div>
            </div>
        </AppLayout>
    );
}
