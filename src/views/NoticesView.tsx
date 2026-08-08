import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, BookMarked, GraduationCap, Megaphone } from 'lucide-react';
import { supabase, type Notice, type NoticePriority } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { Badge, Card, EmptyState, ErrorState, LoadingState, SectionTitle } from '@/components/ui';

const PRIORITY_TONE: Record<NoticePriority, 'rose' | 'amber' | 'slate'> = {
  Urgent: 'rose',
  Exam: 'amber',
  General: 'slate',
};
const FILTERS: (NoticePriority | 'All')[] = ['All', 'Urgent', 'Exam', 'General'];

export function NoticesView() {
  const [notices, setNotices] = useState<Notice[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NoticePriority | 'All'>('All');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from('notices').select('*').order('date_posted', { ascending: false });
      if (cancelled) return;
      if (error) { setError(error.message); return; }
      setNotices(data);
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!notices) return null;
    if (filter === 'All') return notices;
    return notices.filter((n) => n.priority === filter);
  }, [notices, filter]);

  if (error) return <ErrorState message={error} />;
  if (filtered === null) return <LoadingState label="Loading notices…" />;

  return (
    <div className="space-y-6">
      <SectionTitle title="Notice Board" subtitle="Announcements and official communications." icon={<Megaphone className="h-5 w-5" />} />

      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                'whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ' +
                (active ? 'border-sky-500/40 bg-sky-500/10 text-sky-300' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200')
              }
            >
              {f}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No notices" message="The board is clear for now." icon={<Megaphone className="h-6 w-6" />} />
      ) : (
        <div className="space-y-3">
          {filtered.map((n, idx) => (
            <NoticeRow key={n.id} n={n} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

function NoticeRow({ n, index }: { n: Notice; index: number }) {
  const tone = PRIORITY_TONE[n.priority];
  const Icon = n.priority === 'Urgent' ? AlertCircle : n.priority === 'Exam' ? GraduationCap : Megaphone;
  const iconTone = tone === 'rose' ? 'border-rose-500/30 bg-rose-500/10 text-rose-400' : tone === 'amber' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-slate-700 bg-slate-800/60 text-slate-400';

  return (
    <Card hover className="animate-slide-up p-5">
      <div style={{ animationDelay: `${index * 50}ms` }} className="flex items-start gap-4">
        <div className={'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ' + iconTone}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-white">{n.title}</h3>
            <Badge tone={tone}>{n.priority}</Badge>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{n.content}</p>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
            <BookMarked className="h-3 w-3" /> Posted {formatDate(n.date_posted)}
          </p>
        </div>
      </div>
    </Card>
  );
}
