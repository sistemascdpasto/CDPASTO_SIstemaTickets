import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const path = page.url.split('?')[0];

    // Pick the most specific nav item that matches the current path.
    const activeUrl = items
        .map((item) => item.url)
        .filter((url) => path === url || path.startsWith(`${url}/`))
        .sort((a, b) => b.length - a.length)[0];

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Mesa de ayuda</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.url === activeUrl}>
                            <Link href={item.url} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
