import { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, User, Users } from 'lucide-react';
import { supabase, type Faculty } from '@/lib/supabase';
import { initials } from '@/lib/utils';
import { Badge, Card, EmptyState, ErrorState, LoadingState, SectionTitle } from '@/components/ui';

export function FacultyView() {
  const [faculty, setFaculty] = useState<Faculty[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 🔒 Query only safe, non-contact fields from Supabase
      const { data, error } = await supabase
        .from('faculty')
        .select('id, name, designation, department, cabin_location')
        .order('name');

      if (cancelled) return;
      if (error) { setError(error.message); return; }
      setFaculty(data as Faculty[]);
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo<Faculty[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q || !faculty) return faculty ?? [];
    return faculty.filter((f) =>
      [f.name, f.designation, f.department].join(' ').toLowerCase().includes(q)
    );
  }, [faculty, query]);

  if (error) return <ErrorState message={error} />;
  if (faculty === null) return <LoadingState label="Loading faculty directory…" />;

  return (
    <div className="space-y-6">
      <SectionTitle title="Faculty Directory" subtitle="Find department staff and cabin locations." icon={<Users className="h-5 w-5" />} />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, department, or designation…"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No faculty found" message="Try a different search term." icon={<User className="h-6 w-6" />} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((f, idx) => (
            <FacultyCard key={f.id} f={f} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

function FacultyCard({ f, index }: { f: Faculty; index: number }) {
  return (
    <Card hover className="animate-slide-up flex flex-col p-5">
      <div style={{ animationDelay: `${index * 60}ms` }}>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-indigo-700">
            {initials(f.name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-slate-900">{f.name}</h3>
            <p className="text-sm text-slate-600">{f.designation}</p>
            <Badge tone="sky" className="mt-1.5">{f.department}</Badge>
          </div>
        </div>

        {f.cabin_location && (
          <div className="mt-4 text-sm text-slate-600">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-500" /> {f.cabin_location}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}