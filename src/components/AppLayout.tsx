import type { ReactNode } from 'react';
import { LogOut, Sparkles } from 'lucide-react';
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
        <div className={isDark ? 'border-t border-slate-800 p-3' : 'border-t border-slate-200 p-3'}>
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
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className={isDark ? 'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/95 px-4 shadow-[0_10px_30px_rgba(2,6,23,0.28)] backdrop-blur-xl sm:px-6' : 'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur-xl sm:px-6'}>
          {/* Mobile Header Brand */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-indigo-500/10 p-0.5 border border-indigo-500/20">
              <img src="/logo.png" alt="Class Hub Logo" className="h-full w-full object-contain" />
            </div>
            <span className={isDark ? 'text-sm font-bold text-slate-100' : 'text-sm font-bold text-slate-900'}>{BRAND.name}</span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <p className={isDark ? 'text-sm font-semibold text-slate-300' : 'text-sm font-semibold text-slate-700'}>{NAV_ITEMS.find((n) => n.id === active)?.label}</p>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/60 py-1 pl-3 pr-1 backdrop-blur-md">
              <div className="hidden text-right sm:block">
                <p className={isDark ? 'max-w-[160px] truncate text-xs font-semibold text-slate-100' : 'max-w-[160px] truncate text-xs font-semibold text-slate-800'}>{displayName}</p>
                <p className="text-[10px] text-slate-400">{user?.email}</p>
              </div>

              <Avatar url={avatarUrl} name={displayName} />

              <button
                onClick={signOut}
                className="group flex items-center gap-1.5 rounded-full bg-rose-500/10 hover:bg-rose-600 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-white transition-all duration-200 border border-rose-500/20 hover:border-transparent"
              >
                <LogOut className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        <main className={isDark ? 'bg-[#020617] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10' : 'bg-slate-50 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10'}>{children}</main>
      </div>

      {/* Mobile bottom nav with Scroll Hints */}
      <nav className={isDark ? 'fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl lg:hidden' : 'fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden'}>
        {/* Fading Edge Overlays */}
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
      <img src={url} alt={name} className="h-8 w-8 shrink-0 rounded-full border border-slate-700 object-cover" referrerPolicy="no-referrer" />
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-bold text-indigo-400">
      {initials(name)}
    </div>
  );
}