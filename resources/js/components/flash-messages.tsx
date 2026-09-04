import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function FlashMessages() {
    const { flash } = usePage<SharedData>().props;
    const [visible, setVisible] = useState(true);

    const message = flash?.success ?? flash?.error ?? null;
    const isError = Boolean(flash?.error);

    useEffect(() => {
        setVisible(true);
        if (!message) return;
        const timer = setTimeout(() => setVisible(false), 5000);
        return () => clearTimeout(timer);
    }, [message]);

    if (!message || !visible) return null;

    return (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
            <div
                className={cn(
                    'pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg',
                    isError
                        ? 'border-red-300 bg-red-50 text-red-800 dark:border-red-400/30 dark:bg-red-950 dark:text-red-200'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-200',
                )}
            >
                {isError ? <XCircle className="size-5 shrink-0" /> : <CheckCircle2 className="size-5 shrink-0" />}
                <span>{message}</span>
                <button onClick={() => setVisible(false)} className="shrink-0 opacity-60 hover:opacity-100">
                    <X className="size-4" />
                </button>
            </div>
        </div>
    );
}
