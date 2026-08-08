import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock, DoorOpen, User } from 'lucide-react';
import { supabase, type Timetable } from '@/lib/supabase';
import { DAYS, formatTime, todayDow } from '@/lib/utils';
import { Badge, Card, EmptyState, ErrorState, LoadingState, SectionTitle } from '@/components/ui';

const TABS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
type WeekDay = (typeof TABS)[number];

export function TimetableView() {
  const [rows, setRows] = useState<Timetable[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [day, setDay] = useState<WeekDay>(() => {
    const dow = todayDow();
    if (dow >= 1 && dow <= 5) return TABS[dow - 1];
    return 'Monday';
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from('timetable').select('*, faculty(*)').order('start_time');
      if (cancelled) return;
      if (error) { setError(error.message); return; }
      setRows(data);
    })();
    return () => { cancelled = true; };
  }, []);

  const dayIndex = TABS.indexOf(day) + 1;
  const dayClasses = useMemo(
    () => (rows ?? []).filter((r) => r.day_of_week === dayIndex).sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [rows, dayIndex],
  );

  if (error) return <ErrorState message={error} />;
  if (rows === null) return <LoadingState label="Loading timetable…" />;

  const isToday = dayIndex === todayDow();

  return (
    <div className="space-y-6">
      <SectionTitle title="Weekly Timetable" subtitle="Your class schedule, Monday through Friday." icon={<CalendarDays className="h-5 w-5" />} />

      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
        {DAYS.map((_, i) => {
          if (i < 1 || i > 5) return null;
          const wd = TABS[i - 1];
          const active = day === wd;
          return (
            <button
              key={wd}
              onClick={() => setDay(wd)}
              className={
                'relative whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-semibold transition-all ' +
                (active ? 'border-sky-500/40 bg-sky-500/10 text-sky-300' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200')
              }
            >
              {wd}
              {i === todayDow() && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-sky-400 ring-2 ring-slate-950" />}
            </button>
          );
        })}
      </div>

      {isToday && <p className="text-xs font-medium text-sky-400">Showing today's schedule.</p>}

      {dayClasses.length === 0 ? (
        <EmptyState title={`No classes on ${day}`} message="Enjoy the free day." icon={<CalendarDays className="h-6 w-6" />} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dayClasses.map((c, idx) => (
            <Card key={c.id} hover className="animate-slide-up p-5">
              <div style={{ animationDelay: `${idx * 60}ms` }} className="flex items-start justify-between">
                <div className="rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Time</p>
                  <p className="text-sm font-bold text-sky-300">{formatTime(c.start_time)}</p>
                  <p className="text-[10px] text-slate-500">to {formatTime(c.end_time)}</p>
                </div>
                <Badge tone="sky">{c.subject_code}</Badge>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{c.subject_name}</h3>
              <div className="mt-3 space-y-1.5 text-sm text-slate-400">
                <p className="flex items-center gap-2"><DoorOpen className="h-4 w-4 text-slate-500" /> {c.room_number ? `Room ${c.room_number}` : 'Room TBD'}</p>
                <p className="flex items-center gap-2"><User className="h-4 w-4 text-slate-500" /> {c.faculty?.name ?? 'Faculty TBA'}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-500" /> {formatTime(c.start_time)} – {formatTime(c.end_time)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
