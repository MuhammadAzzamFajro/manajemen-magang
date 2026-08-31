/**
 * lib/toast.ts
 * Toast notification store + API (module-scoped, no context required).
 * Render <Toaster /> once in the root layout.
 */

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

type Listener = (items: ToastItem[]) => void;

let items: ToastItem[] = [];
const listeners = new Set<Listener>();
let nextId = 1;

function emit() {
  listeners.forEach((l) => l([...items]));
}

function push(type: ToastType, message: string) {
  const id = nextId++;
  items = [...items, { id, type, message }];
  emit();
  if (typeof window !== 'undefined') {
    window.setTimeout(() => dismiss(id), 3500);
  }
  return id;
}

export function dismiss(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

export function subscribe(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export const toast = {
  success: (message: string) => push('success', message),
  error: (message: string) => push('error', message),
  info: (message: string) => push('info', message),
};