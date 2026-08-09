import type { ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BRAND, NAV_ITEMS, type TabId } from '@/components/nav';
import { initials } from '@/lib/utils';

export function AppLayout({
  active,
  onNavigate,
  theme,
  children,
}: {
  active: TabId;
  onNavigate: (id: TabId) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  children: ReactNode;
}) {
  const { user, signOut } = useAuth();
  const displayName: string = user?.user_metadata?.full_name ?? user?.email ?? 'Student';
  const avatarUrl: string | undefined = user?.user_metadata?.avatar_url;

  const isDark = theme === 'dark';
  const currentNav = NAV_ITEMS.find((n) => n.id === active);

  return (
    <div className={isDark ? 'min-h-screen bg-[#020617] text-slate-100 font-sans' : 'min-h-screen bg-slate-50 text-slate-900 font-sans'}>
      {/* Desktop sidebar */}
      <aside className={isDark ? 'fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-800 bg-slate-900/95 shadow-[0_0_0_1px_rgba(30,41,59,0.6),0_10px_30px_rgba(2,6,23,0.35)] backdrop-blur-xl lg:flex' : 'fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl lg:flex'}>
        {/* Brand Header */}
        <div className={isDark ? 'flex h-16 items-center gap-3 border-b border-slate-800 px-5' : 'flex h-16 items-center gap-3 border-b border-slate-200 px-5'}>
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-500/10 p-1 border border-indigo-500/20">
            <img src="/logo.png" alt="Class Hub Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className={isDark ? 'text-sm font-extrabold tracking-tight text-slate-100' : 'text-sm font-extrabold tracking-tight text-slate-900'}>{BRAND.name}</p>
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-indigo-400/90 font-semibold">Academic Hub</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={
                  'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ' +
                  (isActive
                    ? (isDark ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-indigo-600 text-white shadow-md')
                    : (isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'))
                }
              >
                <Icon className={'h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ' + (isActive ? 'text-white' : (isDark ? 'text-slate-500 group-hover:text-indigo-400' : 'text-slate-500 group-hover:text-indigo-600'))} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className={isDark ? 'border-t border-slate-800 p-3 space-y-2' : 'border-t border-slate-200 p-3 space-y-2'}>
          <div className={isDark ? 'flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5' : 'flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5'}>
            <Avatar url={avatarUrl} name={displayName} />
            <div className="min-w-0 flex-1">
              <p className={isDark ? 'truncate text-xs font-semibold text-slate-100' : 'truncate text-xs font-semibold text-slate-800'}>{displayName}</p>
              <p className="truncate text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Active Session
              </p>
            </div>
            <button
              onClick={signOut}
              title="Sign out"
              className={isDark ? 'rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400' : 'rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600'}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center pt-1">
            <p className="text-[10px] text-slate-500">
              Designed & Developed by <span className="font-bold text-indigo-400">Jershon Paul Isaac R</span>
            </p>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="lg:pl-64">
        {/* REFINED HEADER BAR */}
        <header className={isDark ? 'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800/80 bg-[#020617]/90 px-4 backdrop-blur-xl sm:px-6' : 'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6'}>
          
          {/* Left: Mobile Brand Header */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 p-1.5 border border-slate-700/60 shadow-inner">
              <img src="/logo.png" alt="Class Hub Logo" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-white font-sans">
                Class<span className="text-indigo-400">Hub</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400/80 -mt-1">
                Academic Portal
              </span>
            </div>
          </div>

          {/* Left: Desktop View Title */}
          <div className="hidden lg:flex items-center gap-2.5">
            <h1 className={isDark ? 'text-base font-bold text-white tracking-tight' : 'text-base font-bold text-slate-900 tracking-tight'}>
              {currentNav?.label}
            </h1>
          </div>

          {/* Right: User Profile + Sign Out Controls */}
          <div className="flex items-center gap-2.5">
            <div className={isDark ? 'flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 sm:px-3 sm:py-1.5' : 'flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100/70 p-1.5 sm:px-3 sm:py-1.5'}>
              <Avatar url={avatarUrl} name={displayName} />
              <div className="hidden text-left sm:block">
                <p className={isDark ? 'max-w-[140px] truncate text-xs font-semibold text-slate-100' : 'max-w-[140px] truncate text-xs font-semibold text-slate-800'}>{displayName}</p>
                <p className="max-w-[140px] truncate text-[10px] text-slate-400">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={signOut}
              title="Sign Out"
              className={isDark ? 'flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 transition hover:bg-rose-500 hover:text-white sm:w-auto sm:px-3' : 'flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-600 hover:text-white sm:w-auto sm:px-3'}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline sm:ml-1.5 sm:text-xs sm:font-semibold">Sign Out</span>
            </button>
          </div>
        </header>

        <main className={isDark ? 'bg-[#020617] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10' : 'bg-slate-50 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10'}>{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className={isDark ? 'fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl lg:hidden' : 'fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden'}>
        <div className={isDark ? "pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-slate-900 to-transparent z-10" : "pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10"} />
        <div className={isDark ? "pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 to-transparent z-10" : "pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10"} />

        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto px-3 py-2 scroll-smooth">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={
                  'flex min-w-[72px] shrink-0 flex-col items-center gap-1 rounded-xl px-2.5 py-1.5 text-[10px] font-semibold transition-all duration-200 ' +
                  (isActive 
                    ? (isDark ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-700') 
                    : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'))
                }
              >
                <Icon className="h-5 w-5" />
                <span className="whitespace-nowrap">{item.short}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function Avatar({ url, name }: { url?: string; name: string }) {
  if (url) {
    return (
      <img src={url} alt={name} className="h-7 w-7 shrink-0 rounded-full border border-slate-700 object-cover" referrerPolicy="no-referrer" />
    );
  }
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-bold text-indigo-400">
      {initials(name)}
    </div>
  );
}