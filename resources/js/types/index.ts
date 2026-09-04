import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    flash: { success: string | null; error: string | null };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    identification: string | null;
    email: string | null;
    avatar?: string;
    role: 'user' | 'admin';
    is_admin: boolean;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface ManagedUser {
    id: number;
    name: string;
    identification: string | null;
    email: string | null;
    role: 'user' | 'admin';
    role_label: string;
    is_active: boolean;
    tickets_count?: number;
    assigned_tickets_count?: number;
    created_at: string;
}

export interface UserSummary {
    id: number;
    name: string;
    email: string;
}

export interface Option {
    value: string;
    label: string;
}

export interface TicketStatus {
    id: number;
    name: string;
    slug: string;
    color: string;
    sort_order: number;
    is_default: boolean;
    is_resolved: boolean;
    is_terminal: boolean;
}

export interface Software {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    is_active: boolean;
    tickets_count?: number;
}

export interface TicketAttachment {
    id: number;
    ticket_comment_id: number | null;
    original_name: string;
    mime_type: string | null;
    size: number;
    human_size: string;
    download_url: string;
    created_at: string;
}

export interface TicketComment {
    id: number;
    body: string;
    is_internal: boolean;
    author: UserSummary | null;
    attachments: TicketAttachment[];
    created_at: string;
}

export interface TicketActivity {
    id: number;
    action: string;
    description: string | null;
    properties: Record<string, unknown> | null;
    author: UserSummary | null;
    created_at: string;
}

export interface Ticket {
    id: number;
    reference: string;
    title: string;
    description: string;
    type: Option;
    priority: Option;
    status: TicketStatus;
    software: Software;
    creator?: UserSummary | null;
    assignee?: UserSummary | null;
    comments_count?: number;
    attachments_count?: number;
    comments?: TicketComment[];
    activities?: TicketActivity[];
    attachments?: TicketAttachment[];
    first_responded_at: string | null;
    resolved_at: string | null;
    closed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface PageLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    path: string;
    links: PageLink[];
}

export interface Paginated<T> {
    data: T[];
    links: { first: string | null; last: string | null; prev: string | null; next: string | null };
    meta?: PaginationMeta;
}
