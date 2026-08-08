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
        'rounded-2xl border border-slate-200 bg-white shadow-sm ' +
        (hover ? 'transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 ' : '') +
        className
      }
    >
      {children}
    </div>
  );
}

type BadgeTone = 'slate' | 'sky' | 'amber' | 'rose' | 'emerald' | 'violet';

const TONE_CLASSES: Record<BadgeTone, string> = {
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  sky: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  violet: 'bg-violet-50 text-violet-700 border-violet-200',
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
        {icon && <div className="text-indigo-600">{icon}</div>}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-slate-600">{subtitle}</p>}
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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      {message && <p className="mt-1 max-w-sm text-xs text-slate-500">{message}</p>}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
      <AlertTriangle className="mb-3 h-7 w-7 text-rose-600" />
      <p className="text-sm font-semibold text-rose-700">Something went wrong</p>
      <p className="mt-1 max-w-sm text-xs text-rose-600">{message}</p>
    </div>
  );
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
      <p className="mt-3 text-sm text-slate-600">{label}</p>
    </div>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const BUTTON_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600 shadow-sm',
  secondary: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 border border-transparent',
  danger: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200',
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
