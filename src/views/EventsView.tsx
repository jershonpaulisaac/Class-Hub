import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, ExternalLink, MapPin, Trophy, Users } from 'lucide-react';
import { supabase, type CollegeEvent, type EventCategory } from '@/lib/supabase';
import { formatDate, formatTime } from '@/lib/utils';
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState, SectionTitle } from '@/components/ui';

const CATEGORIES: (EventCategory | 'All')[] = ['All', 'Academic', 'Cultural', 'Sports', 'Hackathon'];

const CATEGORY_TONE: Record<EventCategory, 'sky' | 'emerald' | 'amber' | 'violet'> = {
  Academic: 'sky',
  Cultural: 'violet',
  Sports: 'emerald',
  Hackathon: 'amber',
};

export function EventsView() {
  const [events, setEvents] = useState<CollegeEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<EventCategory | 'All'>('All');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase.from('events').select('*').gte('event_date', today).order('event_date');
      if (cancelled) return;
      if (error) { setError(error.message); return; }
      setEvents(data);
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!events) return null;
    if (filter === 'All') return events;
    return events.filter((e) => e.category === filter);
  }, [events, filter]);

  if (error) return <ErrorState message={error} />;
  if (filtered === null) return <LoadingState label="Loading events…" />;

  return (
    <div className="space-y-6">
      <SectionTitle title="Events & Activities" subtitle="Hackathons, symposiums, sports meets, and workshops." icon={<Trophy className="h-5 w-5" />} />

      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
        {CATEGORIES.map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={
                'whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ' +
                (active ? 'border-sky-500/40 bg-sky-500/10 text-sky-300' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200')
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No events scheduled" message="Check back later for upcoming activities." icon={<Trophy className="h-6 w-6" />} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((ev, idx) => (
            <EventCard key={ev.id} ev={ev} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ ev, index }: { ev: CollegeEvent; index: number }) {
  const tone = CATEGORY_TONE[ev.category];
  return (
    <Card hover className="animate-slide-up flex flex-1 flex-col overflow-hidden p-0">
      <div style={{ animationDelay: `${index * 60}ms` }} className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <Badge tone={tone}>{ev.category}</Badge>
          <span className="text-xs text-slate-500">{formatDate(ev.event_date)}</span>
        </div>
        <h3 className="text-lg font-bold text-white">{ev.title}</h3>
        {ev.description && <p className="mt-1.5 line-clamp-3 text-sm text-slate-400">{ev.description}</p>}
        <div className="mt-4 space-y-1.5 text-sm text-slate-400">
          <p className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-slate-500" /> {formatTime(ev.event_time)}</p>
          {ev.venue && <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-500" /> {ev.venue}</p>}
          {ev.organizer && <p className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-500" /> {ev.organizer}</p>}
        </div>
        {ev.registration_link && (
          <a href={ev.registration_link} target="_blank" rel="noopener noreferrer" className="mt-5">
            <Button variant="primary" className="w-full">Register Now <ExternalLink className="h-4 w-4" /></Button>
          </a>
        )}
      </div>
    </Card>
  );
}
