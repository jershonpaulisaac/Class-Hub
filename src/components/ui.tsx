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
        'rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm ' +
        (hover ? 'transition-all duration-300 hover:border-slate-700 hover:bg-slate-900 ' : '') +
        className
      }
    >
      {children}
    </div>
  );
}

type BadgeTone = 'slate' | 'sky' | 'amber' | 'rose' | 'emerald' | 'violet';

const TONE_CLASSES: Record<BadgeTone, string> = {
  slate: 'bg-slate-800 text-slate-300 border-slate-700',
  sky: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  rose: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  violet: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
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
        {icon && <div className="text-sky-400">{icon}</div>}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>}
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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 px-6 py-14 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/80 text-slate-500">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <p className="text-sm font-semibold text-slate-300">{title}</p>
      {message && <p className="mt-1 max-w-sm text-xs text-slate-500">{message}</p>}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/5 px-6 py-12 text-center">
      <AlertTriangle className="mb-3 h-7 w-7 text-rose-400" />
      <p className="text-sm font-semibold text-rose-300">Something went wrong</p>
      <p className="mt-1 max-w-sm text-xs text-rose-400/70">{message}</p>
    </div>
  );
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/30 px-6 py-14">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-sky-400" />
      <p className="mt-3 text-sm text-slate-500">{label}</p>
    </div>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const BUTTON_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-sky-500 text-white hover:bg-sky-400 border border-sky-400/50 shadow-lg shadow-sky-500/20',
  secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700',
  ghost: 'bg-transparent text-slate-300 hover:bg-slate-800/60 border border-transparent',
  danger: 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30',
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
