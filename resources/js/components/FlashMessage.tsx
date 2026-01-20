import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FlashMessage() {
    const { flash } = usePage().props as any;
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (flash?.message || flash?.success) {
            setMessage(flash.message || flash.success);
            setType('success');
            setIsVisible(true);
            const timer = setTimeout(() => setIsVisible(false), 4000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setIsVisible(true);
            const timer = setTimeout(() => setIsVisible(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!isVisible || !message) return null;

    return (
        <div className={cn(
            "fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 animate-in slide-in-from-top-4 fade-in",
            type === 'success' ? "bg-white border-green-100 text-green-700" : "bg-white border-red-100 text-red-700"
        )}>
            {type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
                <XCircle className="w-5 h-5 text-red-500" />
            )}
            
            <div className="flex-1 text-sm font-medium">
                {message}
            </div>

            <button 
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Close"
            >
                <X className="w-4 h-4 text-slate-400" />
            </button>
        </div>
    );
}
