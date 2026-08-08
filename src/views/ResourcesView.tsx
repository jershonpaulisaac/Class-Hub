import { useEffect, useMemo, useState } from 'react';
import { BookMarked, ExternalLink, FileText, Folder, Search } from 'lucide-react';
import { supabase, type Resource } from '@/lib/supabase';
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState, SectionTitle } from '@/components/ui';

export function ResourcesView() {
  const [items, setItems] = useState<Resource[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState<string>('All');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from('resources').select('*').order('subject_name').order('unit');
      if (cancelled) return;
      if (error) { setError(error.message); return; }
      setItems(data);
    })();
    return () => { cancelled = true; };
  }, []);

  const subjects = useMemo(() => {
    if (!items) return [];
    return Array.from(new Set(items.map((r) => r.subject_name))).sort();
  }, [items]);

  const filtered = useMemo(() => {
    if (!items) return null;
    const q = query.trim().toLowerCase();
    return items.filter((r) => {
      const matchesSubject = subject === 'All' || r.subject_name === subject;
      const matchesQuery = !q || [r.title, r.subject_name, `Unit ${r.unit ?? ''}`].join(' ').toLowerCase().includes(q);
      return matchesSubject && matchesQuery;
    });
  }, [items, query, subject]);

  if (error) return <ErrorState message={error} />;
  if (filtered === null) return <LoadingState label="Loading resources…" />;

  return (
    <div className="space-y-6">
      <SectionTitle title="Resource Locker" subtitle="Subject-wise and unit-wise study materials." icon={<FileText className="h-5 w-5" />} />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, subject, or unit…"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
        />
      </div>

      {subjects.length > 0 && (
        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
          {['All', ...subjects].map((s) => {
            const active = subject === s;
            return (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={
                  'whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ' +
                  (active ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900')
                }
              >
                {s}
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState title="No resources found" message="Try a different search or subject." icon={<Folder className="h-6 w-6" />} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r, idx) => (
            <ResourceCard key={r.id} r={r} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceCard({ r, index }: { r: Resource; index: number }) {
  return (
    <Card hover className="animate-slide-up flex flex-col p-5">
      <div style={{ animationDelay: `${index * 50}ms` }}>
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
            <BookMarked className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold leading-snug text-slate-900">{r.title}</h3>
            <p className="mt-0.5 text-xs text-slate-500">{r.subject_name}</p>
          </div>
        </div>
        {r.unit != null && <Badge tone="slate" className="mb-3">Unit {r.unit}</Badge>}
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {r.file_url && (
            <a href={r.file_url} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="text-xs"><FileText className="h-3.5 w-3.5" /> View PDF</Button>
            </a>
          )}
          {r.drive_link && (
            <a href={r.drive_link} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" className="text-xs"><ExternalLink className="h-3.5 w-3.5" /> Drive</Button>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
