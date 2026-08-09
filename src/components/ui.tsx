import type { ReactNode } from 'react';
import { AlertTriangle, Inbox } from 'lucide-react';

export function Card({
  children,
  className = '',
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={
        'rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none ' +
        (hover ? 'transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800/80 ' : '') +
        className
      }
    >
      {children}
    </div>
  );
}

type BadgeTone = 'slate' | 'sky' | 'amber' | 'rose' | 'emerald' | 'violet';

const TONE_CLASSES: Record<BadgeTone, string> = {
  slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
  sky: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30',
  amber: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
  rose: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
  violet: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30',
};

export function Badge({
  children,
  tone = 'slate',
  className = '',
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ' +
        TONE_CLASSES[tone] +
        ' ' +
        className
      }
    >
      {children}
    </span>
  );
}

export function SectionTitle({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex items-center gap-3">
        {icon && <div className="text-indigo-600 dark:text-indigo-400">{icon}</div>}
        <div>
          {/* ✅ Fixed: Title & Subtitle now support dark mode */}
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  icon,
}: {
  title: string;
  message?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-800/60">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</p>
      {message && <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">{message}</p>}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-6 py-12 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
      <AlertTriangle className="mb-3 h-7 w-7 text-rose-600 dark:text-rose-400" />
      <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">Something went wrong</p>
      <p className="mt-1 max-w-sm text-xs text-rose-600 dark:text-rose-300">{message}</p>
    </div>
  );
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 dark:border-slate-700 dark:bg-slate-800/60">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

{/* ✅ Fixed: Added dark mode variants for all buttons */}
const BUTTON_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600 shadow-sm dark:bg-indigo-500 dark:border-indigo-500 dark:hover:bg-indigo-600',
  secondary: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700/80',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 border border-transparent dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
  danger: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30 dark:hover:bg-rose-500/25',
};

export function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  onClick,
  disabled,
  title,
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ' +
        BUTTON_CLASSES[variant] +
        ' ' +
        className
      }
    >
      {children}
    </button>
  );
}