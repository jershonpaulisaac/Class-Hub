import type { ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BRAND, NAV_ITEMS, type TabId } from '@/components/nav';
import { initials } from '@/lib/utils';

export function AppLayout({
  active,
  onNavigate,
  children,
}: {
  active: TabId;
  onNavigate: (id: TabId) => void;
  children: ReactNode;
}) {
  const { user, signOut } = useAuth();
  const displayName: string = user?.user_metadata?.full_name ?? user?.email ?? 'Student';
  const avatarUrl: string | undefined = user?.user_metadata?.avatar_url;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-800 bg-slate-900/40 backdrop-blur-xl lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-800 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
            <BRAND.icon className="h-5 w-5 text-sky-400" />
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-tight text-white">{BRAND.name}</p>
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
                    ? 'bg-sky-500/10 text-sky-300 shadow-sm ring-1 ring-sky-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200')
                }
              >
                <Icon className={'h-4.5 w-4.5 shrink-0 transition ' + (isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300')} />
                <span>{item.label}</span>
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-400" />}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/40 px-3 py-2.5">
            <Avatar url={avatarUrl} name={displayName} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-200">{displayName}</p>
              <p className="truncate text-[10px] text-slate-500">Signed in</p>
            </div>
            <button
              onClick={signOut}
              title="Sign out"
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-700 hover:text-rose-300"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
              <BRAND.icon className="h-4 w-4 text-sky-400" />
            </div>
            <span className="text-sm font-bold text-white">{BRAND.name}</span>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-slate-300">{NAV_ITEMS.find((n) => n.id === active)?.label}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2.5 sm:flex">
              <div className="text-right">
                <p className="max-w-[160px] truncate text-xs font-semibold text-slate-200">{displayName}</p>
                <p className="text-[10px] text-slate-500">{user?.email}</p>
              </div>
            </div>
            <Avatar url={avatarUrl} name={displayName} />
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-rose-500/30 hover:text-rose-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        <main className="px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl lg:hidden">
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
                  (isActive ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300')
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
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-bold text-sky-300">
      {initials(name)}
    </div>
  );
}
