import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BarChart3, LayoutGrid, LifeBuoy, PlusCircle, Ticket, Users } from 'lucide-react';
import AppLogo from './app-logo';

const userNavItems: NavItem[] = [
    { title: 'Panel', url: '/dashboard', icon: LayoutGrid },
    { title: 'Crear ticket', url: '/tickets/create', icon: PlusCircle },
    { title: 'Mis tickets', url: '/tickets', icon: Ticket },
];

const adminNavItems: NavItem[] = [
    { title: 'Panel', url: '/admin/dashboard', icon: LayoutGrid },
    { title: 'Tickets', url: '/admin/tickets', icon: Ticket },
    { title: 'Estadísticas', url: '/admin/statistics', icon: BarChart3 },
    { title: 'Softwares', url: '/admin/softwares', icon: LifeBuoy },
    { title: 'Usuarios', url: '/admin/users', icon: Users },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.is_admin ?? false;
    const items = isAdmin ? adminNavItems : userNavItems;
    const home = isAdmin ? '/admin/dashboard' : '/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={home} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={items} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
