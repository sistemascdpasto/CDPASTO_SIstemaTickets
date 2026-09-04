import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Software } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Softwares', href: '/admin/softwares' }];

interface Props {
    softwares: { data: Software[] };
}

const empty = { name: '', description: '', color: 'amber', is_active: true as boolean };

export default function SoftwaresIndex({ softwares }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Software | null>(null);
    const form = useForm<typeof empty>({ ...empty });

    function openCreate() {
        setEditing(null);
        form.setDefaults({ ...empty });
        form.reset();
        form.clearErrors();
        setOpen(true);
    }

    function openEdit(software: Software) {
        setEditing(software);
        form.setData({
            name: software.name,
            description: software.description ?? '',
            color: software.color ?? 'amber',
            is_active: software.is_active,
        });
        form.clearErrors();
        setOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const onSuccess = () => setOpen(false);
        if (editing) {
            form.put(`/admin/softwares/${editing.id}`, { onSuccess, preserveScroll: true });
        } else {
            form.post('/admin/softwares', { onSuccess, preserveScroll: true });
        }
    }

    function destroy(software: Software) {
        if (!confirm(`¿Eliminar "${software.name}"?`)) return;
        router.delete(`/admin/softwares/${software.id}`, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de softwares" />

            <div className="space-y-5 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Softwares y sistemas</h1>
                        <p className="text-sm text-muted-foreground">Catálogo administrable de sistemas de la empresa.</p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus className="size-4" /> Nuevo software
                    </Button>
                </div>

                <Card className="overflow-hidden p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead className="hidden md:table-cell">Descripción</TableHead>
                                <TableHead>Tickets</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {softwares.data.map((software) => (
                                <TableRow key={software.id}>
                                    <TableCell className="font-medium">{software.name}</TableCell>
                                    <TableCell className="hidden md:table-cell max-w-md truncate text-sm text-muted-foreground">
                                        {software.description ?? '—'}
                                    </TableCell>
                                    <TableCell>{software.tickets_count ?? 0}</TableCell>
                                    <TableCell>
                                        <span
                                            className={
                                                'rounded-full px-2 py-0.5 text-xs font-medium ' +
                                                (software.is_active
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'
                                                    : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-400/10 dark:text-zinc-300')
                                            }
                                        >
                                            {software.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(software)}>
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => destroy(software)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Editar software' : 'Nuevo software'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                            <InputError message={form.errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea id="description" rows={3} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                            <InputError message={form.errors.description} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_active"
                                checked={form.data.is_active}
                                onCheckedChange={(v) => form.setData('is_active', v === true)}
                            />
                            <Label htmlFor="is_active">Activo (disponible al crear tickets)</Label>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                Guardar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
