import { useEffect, useMemo, useState } from 'react';
import { Mail, MapPin, Phone, Search, User, Users } from 'lucide-react';
import { supabase, type Faculty } from '@/lib/supabase';
import { initials, sanitizePhone, whatsappLink } from '@/lib/utils';
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState, SectionTitle } from '@/components/ui';

export function FacultyView() {
  const [faculty, setFaculty] = useState<Faculty[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from('faculty').select('*').order('name');
      if (cancelled) return;
      if (error) { setError(error.message); return; }
      setFaculty(data);
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo<Faculty[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q || !faculty) return faculty ?? [];
    return faculty.filter((f) => [f.name, f.designation, f.department, f.email ?? ''].join(' ').toLowerCase().includes(q));
  }, [faculty, query]);

  if (error) return <ErrorState message={error} />;
  if (faculty === null) return <LoadingState label="Loading faculty directory…" />;

  return (
    <div className="space-y-6">
      <SectionTitle title="Faculty Directory" subtitle="Reach any professor or lab instructor in one tap." icon={<Users className="h-5 w-5" />} />

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
  const wa = whatsappLink(f.whatsapp_number, f.name);
  const phone = sanitizePhone(f.whatsapp_number);

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

        <div className="mt-4 space-y-1.5 text-sm text-slate-600">
          {f.cabin_location && <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-500" /> {f.cabin_location}</p>}
          {f.email && <p className="flex items-center gap-2 truncate"><Mail className="h-4 w-4 text-slate-500" /> {f.email}</p>}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {wa ? (
            <a href={wa} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600">
                <WhatsAppGlyph className="h-4 w-4" /> WhatsApp
              </Button>
            </a>
          ) : (
            <Button variant="secondary" disabled title="No WhatsApp number"><WhatsAppGlyph className="h-4 w-4" /> N/A</Button>
          )}
          {f.email && <a href={`mailto:${f.email}`}><Button variant="secondary"><Mail className="h-4 w-4" /> Email</Button></a>}
          {phone && <a href={`tel:${phone}`}><Button variant="ghost"><Phone className="h-4 w-4" /> Call</Button></a>}
        </div>
      </div>
    </Card>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
