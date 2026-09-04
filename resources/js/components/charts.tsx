import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { chartColors } from '@/lib/tickets';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface Datum {
    key: string;
    label: string;
    value: number;
}

const axis = { fontSize: 12, fill: 'var(--muted-foreground)' };
const tooltipStyle = {
    background: 'var(--popover)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: 12,
    color: 'var(--popover-foreground)',
};

function ChartShell({ title, children, empty }: { title: string; children: React.ReactNode; empty: boolean }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {empty ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">Sin datos para el período seleccionado.</p>
                ) : (
                    <div className="h-64 w-full">{children}</div>
                )}
            </CardContent>
        </Card>
    );
}

export function CategoryBarChart({ title, data }: { title: string; data: Datum[] }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    return (
        <ChartShell title={title} empty={total === 0}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
                    <CartesianGrid horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" allowDecimals={false} tick={axis} stroke="var(--border)" />
                    <YAxis type="category" dataKey="label" width={130} tick={axis} stroke="var(--border)" />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--muted)' }} />
                    <Bar dataKey="value" name="Tickets" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                        {data.map((entry, index) => (
                            <Cell key={entry.key} fill={chartColors[index % chartColors.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartShell>
    );
}

export function CategoryDonutChart({ title, data }: { title: string; data: Datum[] }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    return (
        <ChartShell title={title} empty={total === 0}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="label" innerRadius={55} outerRadius={90} paddingAngle={2} isAnimationActive={false}>
                        {data.map((entry, index) => (
                            <Cell key={entry.key} fill={chartColors[index % chartColors.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend
                        verticalAlign="middle"
                        align="right"
                        layout="vertical"
                        iconType="circle"
                        wrapperStyle={{ fontSize: 12 }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </ChartShell>
    );
}

interface TrendPoint {
    label: string;
    created: number;
    resolved: number;
}

export function TrendLineChart({ title, data }: { title: string; data: TrendPoint[] }) {
    const total = data.reduce((sum, d) => sum + d.created + d.resolved, 0);
    return (
        <ChartShell title={title} empty={total === 0}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={axis} stroke="var(--border)" />
                    <YAxis allowDecimals={false} tick={axis} stroke="var(--border)" width={32} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12 }} iconType="plainline" />
                    <Line type="monotone" dataKey="created" name="Creados" stroke={chartColors[0]} strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="resolved" name="Resueltos" stroke={chartColors[2]} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
        </ChartShell>
    );
}
