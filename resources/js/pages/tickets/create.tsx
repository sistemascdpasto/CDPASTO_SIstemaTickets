import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Option, type Software } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Paperclip, X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Mis tickets', href: '/tickets' },
    { title: 'Nuevo ticket', href: '/tickets/create' },
];

interface Props {
    softwares: { data: Software[] };
    types: Option[];
    priorities: Option[];
}

export default function CreateTicket({ softwares, types, priorities }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        software_id: string;
        type: string;
        priority: string;
        title: string;
        description: string;
        attachments: File[];
    }>({
        software_id: '',
        type: '',
        priority: 'medium',
        title: '',
        description: '',
        attachments: [],
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/tickets', { forceFormData: true });
    }

    function removeFile(index: number) {
        setData(
            'attachments',
            data.attachments.filter((_, i) => i !== index),
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo ticket" />

            <div className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-6">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Registrar nueva solicitud</h1>
                    <p className="text-sm text-muted-foreground">
                        Describe tu solicitud con el mayor detalle posible para agilizar la atención.
                    </p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="software_id">Software / sistema</Label>
                                    <NativeSelect
                                        id="software_id"
                                        value={data.software_id}
                                        onChange={(e) => setData('software_id', e.target.value)}
                                    >
                                        <option value="">Selecciona un sistema…</option>
                                        {softwares.data.map((software) => (
                                            <option key={software.id} value={software.id}>
                                                {software.name}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                    <InputError message={errors.software_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipo de solicitud</Label>
                                    <NativeSelect id="type" value={data.type} onChange={(e) => setData('type', e.target.value)}>
                                        <option value="">Selecciona un tipo…</option>
                                        {types.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                    <InputError message={errors.type} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Asunto</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Resume el problema o la solicitud"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    rows={6}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Detalla los pasos para reproducir el problema, mensajes de error, fechas, etc."
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="space-y-2">
                                <Label>Prioridad</Label>
                                <div className="flex flex-wrap gap-2">
                                    {priorities.map((priority) => (
                                        <button
                                            key={priority.value}
                                            type="button"
                                            onClick={() => setData('priority', priority.value)}
                                            className={
                                                'rounded-md border px-3 py-1.5 text-sm transition-colors ' +
                                                (data.priority === priority.value
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : 'border-input hover:bg-accent')
                                            }
                                        >
                                            {priority.label}
                                        </button>
                                    ))}
                                </div>
                                <InputError message={errors.priority} />
                            </div>

                            <div className="space-y-2">
                                <Label>Archivos o evidencias (opcional)</Label>
                                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-input px-3 py-3 text-sm text-muted-foreground hover:bg-accent">
                                    <Paperclip className="size-4" />
                                    Seleccionar archivos (máx. 10 MB c/u)
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => setData('attachments', Array.from(e.target.files ?? []))}
                                    />
                                </label>
                                {data.attachments.length > 0 && (
                                    <ul className="space-y-1">
                                        {data.attachments.map((file, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm">
                                                <span className="truncate">{file.name}</span>
                                                <button type="button" onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive">
                                                    <X className="size-3.5" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <InputError message={errors['attachments.0' as keyof typeof errors] as string} />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    Crear ticket
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
