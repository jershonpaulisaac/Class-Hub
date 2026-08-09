import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CalendarClock,
  ClipboardList,
  Megaphone,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { supabase, type Assignment, type CollegeEvent, type Notice, type Timetable } from '@/lib/supabase';
import { DAYS, daysUntil, formatDate, formatFullDate, formatTime, greeting, nowHHMM, todayDow } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Badge, Card, EmptyState, ErrorState, LoadingState } from '@/components/ui';
import { CountdownBadge, PriorityBadge } from '@/components/Badges';
import type { TabId } from '@/components/nav';

export function OverviewView({ onNavigate }: { onNavigate: (id: TabId) => void }) {
  const { user } = useAuth();
  const [clock, setClock] = useState(new Date());
  const [timetable, setTimetable] = useState<Timetable[] | null>(null);
  const [events, setEvents] = useState<CollegeEvent[] | null>(null);
  const [notices, setNotices] = useState<Notice[] | null>(null);
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [tt, ev, no, asg] = await Promise.all([
        supabase.from('timetable').select('*, faculty(*)').order('day_of_week').order('start_time'),
        supabase.from('events').select('*').gte('event_date', today).order('event_date'),
        supabase.from('notices').select('*').order('date_posted', { ascending: false }).limit(3),
        supabase.from('assignments').select('*').order('due_date').limit(5),
      ]);
      if (cancelled) return;
      if (tt.error || ev.error || no.error || asg.error) {
        setError(tt.error?.message || ev.error?.message || no.error?.message || asg.error?.message || 'Failed to load');
        return;
      }
      setTimetable(tt.data);
      setEvents(ev.data);
      setNotices(no.data);
      setAssignments(asg.data);
    })();
    return () => { cancelled = true; };
  }, []);

  const userName = user?.user_metadata?.full_name ?? user?.email ?? 'Student';
  const todayClasses = (timetable ?? []).filter((c) => String(c.day_of_week).toLowerCase() === String(todayDow()).toLowerCase() || c.day_of_week === todayDow());
  const now = nowHHMM();
  const inProgress = todayClasses.find((c) => c.start_time <= now && c.end_time > now) ?? null;
  const nextUp = todayClasses.find((c) => c.start_time >= now) ?? null;
  const spotlight = (events ?? []).find((e) => daysUntil(e.event_date) >= 0) ?? null;
  const urgentNotices = (notices ?? []).filter((n) => n.priority === 'Urgent');
  const upcomingAssignments = (assignments ?? []).filter((a) => daysUntil(a.due_date) >= 0).slice(0, 4);
  const isWeekend = todayDow() === 0 || todayDow() === 6;

  if (error) return <ErrorState message={error} />;
  if (timetable === null || events === null || notices === null || assignments === null)
    return <LoadingState label="Loading your dashboard…" />;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <p className="text-sm text-slate-600 dark:text-slate-400">{formatFullDate(clock)}</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {greeting()}, {userName.split(' ')[0].split('@')[0]}.
        </h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <CalendarClock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          {clock.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Today's Classes" value={todayClasses.length} icon={<BookOpen className="h-4 w-4" />} />
        <StatCard label="Upcoming Events" value={(events ?? []).length} icon={<Trophy className="h-4 w-4" />} tone="emerald" />
        <StatCard label="Active Assignments" value={upcomingAssignments.length} icon={<ClipboardList className="h-4 w-4" />} tone="amber" />
        <StatCard label="Urgent Notices" value={urgentNotices.length} icon={<Megaphone className="h-4 w-4" />} tone="rose" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="overflow-hidden p-0">
            <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3 dark:border-slate-800">
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{inProgress ? 'Class in Session' : 'Next Up'}</h2>
            </div>
            <div className="p-5">
              {inProgress ? (
                <NextClassCard cls={inProgress} live />
              ) : nextUp ? (
                <NextClassCard cls={nextUp} />
              ) : (
                <EmptyState
                  title={isWeekend ? "It's the weekend" : 'No more classes today'}
                  message="Enjoy the break or get ahead on assignments."
                  icon={<CalendarClock className="h-6 w-6" />}
                />
              )}
            </div>
          </Card>

          {spotlight && (
            <Card hover className="group cursor-pointer overflow-hidden p-0">
              <button onClick={() => onNavigate('events')} className="block w-full text-left">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-sky-500/10 dark:from-emerald-500/10 dark:to-sky-500/5" />
                  <div className="relative flex items-start justify-between gap-4 p-5">
                    <div>
                      <Badge tone="emerald" className="mb-3">
                        <Trophy className="h-3 w-3" /> Spotlight Event
                      </Badge>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{spotlight.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-700 dark:text-slate-400">{spotlight.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <CalendarClock className="h-3.5 w-3.5" /> {formatDate(spotlight.event_date)} · {formatTime(spotlight.event_time)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3.5 w-3.5" /> {spotlight.venue}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400" />
                  </div>
                </div>
              </button>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 dark:border-slate-800">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Megaphone className="h-4 w-4 text-rose-600 dark:text-rose-400" /> Pinned Notices
              </h2>
              <button onClick={() => onNavigate('notices')} className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">View all</button>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {(notices ?? []).length === 0 ? (
                <p className="px-5 py-8 text-center text-xs text-slate-500 dark:text-slate-400">No notices.</p>
              ) : (
                (notices ?? []).map((n) => (
                  <div key={n.id} className="px-5 py-3.5">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <PriorityBadge priority={n.priority} />
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{formatDate(n.date_posted)}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">{n.content}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 dark:border-slate-800">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <ClipboardList className="h-4 w-4 text-amber-600 dark:text-amber-400" /> Due Soon
              </h2>
              <button onClick={() => onNavigate('assignments')} className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">Track</button>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {upcomingAssignments.length === 0 ? (
                <p className="px-5 py-8 text-center text-xs text-slate-500 dark:text-slate-400">All caught up.</p>
              ) : (
                upcomingAssignments.map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{a.title}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{a.subject_name}</p>
                    </div>
                    <CountdownBadge days={daysUntil(a.due_date)} />
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function NextClassCard({ cls, live = false }: { cls: Timetable; live?: boolean }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Start</span>
          <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{formatTime(cls.start_time)}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cls.subject_name}</h3>
            {live && (
              <span className="flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500 dark:bg-rose-400" /> LIVE
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{cls.subject_code}</p>
          <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" /> Room {cls.room_number ?? 'TBD'}
            </span>
            {cls.faculty && (
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> {cls.faculty.name}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="text-left sm:text-right">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Ends</span>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formatTime(cls.end_time)}</p>
      </div>
    </div>
  );
}

type Tone = 'sky' | 'emerald' | 'amber' | 'rose';
const TONES: Record<Tone, string> = {
  sky: 'text-indigo-700 bg-indigo-50 dark:bg-indigo-500/15 dark:text-indigo-300',
  emerald: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-300',
  amber: 'text-amber-700 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300',
  rose: 'text-rose-700 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300',
};

function StatCard({ label, value, icon, tone = 'sky' }: { label: string; value: number; icon: React.ReactNode; tone?: Tone }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className={'flex h-9 w-9 items-center justify-center rounded-lg ' + TONES[tone]}>{icon}</div>
      <div>
        <p className="text-xl font-extrabold text-slate-900 dark:text-white">{value}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </Card>
  );
}

export { AlertCircle };