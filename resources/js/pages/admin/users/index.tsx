import InputError from '@/components/input-error';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ManagedUser, type Option, type Paginated } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { KeyRound, Pencil, Search, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Usuarios', href: '/admin/users' }];

interface Props {
    users: Paginated<ManagedUser>;
    filters: { role?: string; search?: string; status?: string };
    roles: Option[];
}

const empty = { name: '', identification: '', email: '', role: 'user', is_active: true as boolean };

export default function UsersIndex({ users, filters, roles }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ManagedUser | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');
    const form = useForm<typeof empty>({ ...empty });

    useEffect(() => {
        const t = setTimeout(() => {
            if ((filters.search ?? '') === search) return;
            router.get('/admin/users', { ...filters, search: search || undefined }, { preserveState: true, replace: true });
        }, 350);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    function navigate(patch: Partial<Props['filters']>) {
        const params = { ...filters, ...patch };
        Object.keys(params).forEach((k) => !params[k as keyof typeof params] && delete params[k as keyof typeof params]);
        router.get('/admin/users', params, { preserveState: true, replace: true });
    }

    function openCreate() {
        setEditing(null);
        form.setData({ ...empty });
        form.clearErrors();
        setOpen(true);
    }

    function openEdit(user: ManagedUser) {
        setEditing(user);
        form.setData({
            name: user.name,
            identification: user.identification ?? '',
            email: user.email ?? '',
            role: user.role,
            is_active: user.is_active,
        });
        form.clearErrors();
        setOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const onSuccess = () => setOpen(false);
        if (editing) {
            form.put(`/admin/users/${editing.id}`, { onSuccess, preserveScroll: true });
        } else {
            form.post('/admin/users', { onSuccess, preserveScroll: true });
        }
    }

    function resetPassword(user: ManagedUser) {
        if (!confirm(`¿Restablecer la contraseña de ${user.name} a su número de identificación (${user.identification})?`)) return;
        router.put(`/admin/users/${user.id}/password`, {}, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de usuarios" />

            <div className="space-y-5 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Gestión de usuarios</h1>
                        <p className="text-sm text-muted-foreground">
                            Las cuentas se crean aquí. El número de identificación es el usuario y la contraseña inicial.
                        </p>
                    </div>
                    <Button onClick={openCreate}>
                        <UserPlus className="size-4" /> Nuevo usuario
                    </Button>
                </div>

                <Card className="space-y-3 p-4">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nombre, identificación o correo…"
                            className="pl-9"
                        />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        <NativeSelect value={filters.role ?? ''} onChange={(e) => navigate({ role: e.target.value || undefined })}>
                            <option value="">Rol: todos</option>
                            {roles.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </NativeSelect>
                        <NativeSelect value={filters.status ?? ''} onChange={(e) => navigate({ status: e.target.value || undefined })}>
                            <option value="">Estado: todos</option>
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                        </NativeSelect>
                    </div>
                </Card>

                <Card className="overflow-hidden p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Identificación</TableHead>
                                <TableHead className="hidden md:table-cell">Correo</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="hidden lg:table-cell">Tickets</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="font-mono text-sm">{user.identification ?? '—'}</TableCell>
                                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{user.email ?? '—'}</TableCell>
                                    <TableCell>
                                        <span
                                            className={
                                                'rounded-full px-2 py-0.5 text-xs font-medium ' +
                                                (user.role === 'admin'
                                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300'
                                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-400/10 dark:text-slate-300')
                                            }
                                        >
                                            {user.role_label}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={
                                                'rounded-full px-2 py-0.5 text-xs font-medium ' +
                                                (user.is_active
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'
                                                    : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-400/10 dark:text-zinc-300')
                                            }
                                        >
                                            {user.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                        {user.tickets_count ?? 0} creados · {user.assigned_tickets_count ?? 0} asignados
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" title="Editar" onClick={() => openEdit(user)}>
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" title="Restablecer contraseña" onClick={() => resetPassword(user)}>
                                                <KeyRound className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                <Pagination meta={users.meta} />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Editar usuario' : 'Nuevo usuario'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre completo</Label>
                            <Input id="name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                            <InputError message={form.errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="identification">Número de identificación</Label>
                            <Input
                                id="identification"
                                inputMode="numeric"
                                value={form.data.identification}
                                onChange={(e) => form.setData('identification', e.target.value)}
                                placeholder="Solo dígitos"
                            />
                            <InputError message={form.errors.identification} />
                            {!editing && (
                                <p className="text-xs text-muted-foreground">
                                    Será el usuario y la contraseña inicial de acceso.
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo (opcional)</Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                            />
                            <InputError message={form.errors.email} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Rol</Label>
                            <NativeSelect id="role" value={form.data.role} onChange={(e) => form.setData('role', e.target.value)}>
                                {roles.map((r) => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </NativeSelect>
                            <InputError message={form.errors.role} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_active"
                                checked={form.data.is_active}
                                onCheckedChange={(v) => form.setData('is_active', v === true)}
                            />
                            <Label htmlFor="is_active">Cuenta activa</Label>
                        </div>
                        <InputError message={form.errors.is_active} />
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
