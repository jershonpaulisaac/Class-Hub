import type { ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BRAND, NAV_ITEMS, type TabId } from '@/components/nav';
import { initials } from '@/lib/utils';

export function AppLayout({
  active,
  onNavigate,
  theme,
  onToggleTheme,
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
    <div className={isDark ? 'min-h-screen bg-[#020617] text-slate-100' : 'min-h-screen bg-slate-50 text-slate-900'}>
      {/* Desktop sidebar */}
      <aside className={isDark ? 'fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-800 bg-slate-900/95 shadow-[0_0_0_1px_rgba(30,41,59,0.6),0_10px_30px_rgba(2,6,23,0.35)] backdrop-blur-xl lg:flex' : 'fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl lg:flex'}>
        <div className={isDark ? 'flex h-16 items-center gap-2.5 border-b border-slate-800 px-5' : 'flex h-16 items-center gap-2.5 border-b border-slate-200 px-5'}>
          {/* Custom Image Logo */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl">
            <img src="/logo.png" alt="Class Hub Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className={isDark ? 'text-sm font-extrabold tracking-tight text-slate-100' : 'text-sm font-extrabold tracking-tight text-slate-900'}>{BRAND.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Academic Hub</p>
          </div>
        </div>

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
                    ? (isDark ? 'bg-indigo-500/15 text-indigo-400 shadow-sm ring-1 ring-indigo-500/20' : 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100')
                    : (isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'))
                }
              >
                <Icon className={'h-4.5 w-4.5 shrink-0 transition ' + (isActive ? 'text-indigo-600' : (isDark ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-700'))} />
                <span>{item.label}</span>
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />}
              </button>
            );
          })}
        </nav>

        <div className={isDark ? 'border-t border-slate-800 p-3' : 'border-t border-slate-200 p-3'}>
          <div className={isDark ? 'flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5' : 'flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5'}>
            <Avatar url={avatarUrl} name={displayName} />
            <div className="min-w-0 flex-1">
              <p className={isDark ? 'truncate text-xs font-semibold text-slate-100' : 'truncate text-xs font-semibold text-slate-800'}>{displayName}</p>
              <p className="truncate text-[10px] text-slate-500">Signed in</p>
            </div>
            <button
              onClick={signOut}
              title="Sign out"
              className={isDark ? 'rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-rose-400' : 'rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-rose-600'}
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
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
              <img src="/logo.png" alt="Class Hub Logo" className="h-full w-full object-contain" />
            </div>
            <span className={isDark ? 'text-sm font-bold text-slate-100' : 'text-sm font-bold text-slate-900'}>{BRAND.name}</span>
          </div>

          <div className="hidden lg:block">
            <p className={isDark ? 'text-sm font-semibold text-slate-300' : 'text-sm font-semibold text-slate-700'}>{NAV_ITEMS.find((n) => n.id === active)?.label}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2.5 sm:flex">
              <div className="text-right">
                <p className={isDark ? 'max-w-[160px] truncate text-xs font-semibold text-slate-100' : 'max-w-[160px] truncate text-xs font-semibold text-slate-800'}>{displayName}</p>
                <p className="text-[10px] text-slate-500">{user?.email}</p>
              </div>
            </div>
            <Avatar url={avatarUrl} name={displayName} />
            
            <button
              onClick={signOut}
              className={isDark ? 'inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-700 hover:bg-slate-800' : 'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50'}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        <main className={isDark ? 'bg-[#020617] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10' : 'bg-slate-50 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10'}>{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className={isDark ? 'fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-900/95 shadow-[0_-10px_25px_rgba(2,6,23,0.2)] backdrop-blur-xl lg:hidden' : 'fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl lg:hidden'}>
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto px-2 py-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={
                  'flex min-w-[64px] flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition ' +
                  (isActive ? (isDark ? 'text-indigo-400' : 'text-indigo-700') : (isDark ? 'text-slate-500 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'))
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