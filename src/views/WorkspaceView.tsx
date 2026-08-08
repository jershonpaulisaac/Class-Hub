import { useCallback, useEffect, useState } from 'react';
import {
  FileText,
  Loader2,
  NotebookPen,
  Plus,
  Save,
  Search,
  Trash2,
  UserCircle,
} from 'lucide-react';
import { supabase, type PersonalNote } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { initials } from '@/lib/utils';
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState, SectionTitle } from '@/components/ui';

type SubTab = 'notes' | 'profile';

export function WorkspaceView() {
  const [tab, setTab] = useState<SubTab>('notes');

  return (
    <div className="space-y-6">
      <SectionTitle title="Personal Workspace" subtitle="Private notebook and profile — only visible to you." icon={<NotebookPen className="h-5 w-5" />} />

      <div className="flex w-fit gap-1 rounded-xl bg-slate-800/60 p-1">
        {(['notes', 'profile'] as SubTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              'rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ' +
              (tab === t ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200')
            }
          >
            {t === 'notes' ? 'My Notes' : 'Profile'}
          </button>
        ))}
      </div>

      {tab === 'notes' ? <NotesPanel /> : <ProfilePanel />}
    </div>
  );
}

function NotesPanel() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<PersonalNote[] | null>(null);
  const [active, setActive] = useState<PersonalNote | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.from('personal_notes').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
    if (error) { setError(error.message); return; }
    setNotes(data);
    setError(null);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const filtered: PersonalNote[] = (notes ?? []).filter((n) =>
    !query.trim() ? true : (n.title + ' ' + n.content).toLowerCase().includes(query.toLowerCase()),
  );

  function selectNote(n: PersonalNote) {
    setActive(n);
    setTitle(n.title);
    setContent(n.content);
  }

  function resetEditor() {
    setActive(null);
    setTitle('');
    setContent('');
  }

  async function createNote() {
    if (!user) return;
    setCreating(true);
    setError(null);
    const { data, error } = await supabase
      .from('personal_notes')
      .insert({ user_id: user.id, title: 'Untitled note', content: '' })
      .select('*')
      .single();
    setCreating(false);
    if (error) { setError(error.message); return; }
    setNotes((prev) => [data, ...(prev ?? [])]);
    selectNote(data);
  }

  async function saveNote() {
    if (!active || !user) return;
    setSaving(true);
    setError(null);
    const { data, error } = await supabase
      .from('personal_notes')
      .update({ title: title.trim() || 'Untitled', content, updated_at: new Date().toISOString() })
      .eq('id', active.id)
      .select('*')
      .single();
    setSaving(false);
    if (error) { setError(error.message); return; }
    setNotes((prev) => (prev ?? []).map((n) => (n.id === data.id ? data : n)));
    setActive(data);
  }

  async function deleteNote(id: string) {
    if (!user) return;
    setError(null);
    const { error } = await supabase.from('personal_notes').delete().eq('id', id);
    if (error) { setError(error.message); return; }
    setNotes((prev) => (prev ?? []).filter((n) => n.id !== id));
    if (active?.id === id) resetEditor();
  }

  if (notes === null) return <LoadingState label="Loading your notes…" />;

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes…"
                className="w-full rounded-lg border border-slate-800 bg-slate-900/60 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
              />
            </div>
            <Button variant="primary" onClick={createNote} disabled={creating} className="px-3 py-2">
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>

          {filtered.length === 0 ? (
            <EmptyState title="No notes yet" message="Create your first note with the + button." icon={<NotebookPen className="h-6 w-6" />} />
          ) : (
            <div className="space-y-2">
              {filtered.map((n) => (
                <button
                  key={n.id}
                  onClick={() => selectNote(n)}
                  className={
                    'group w-full rounded-xl border p-3 text-left transition ' +
                    (active?.id === n.id ? 'border-sky-500/40 bg-sky-500/10' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700')
                  }
                >
                  <p className="truncate text-sm font-semibold text-slate-200">{n.title || 'Untitled'}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{n.content || 'No content'}</p>
                  <p className="mt-1 text-[10px] text-slate-600">
                    {new Date(n.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <Card className="flex flex-col p-0">
          {active ? (
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FileText className="h-4 w-4" /> Editing note
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="danger" onClick={() => deleteNote(active.id)} className="px-3 py-1.5 text-xs">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                  <Button variant="primary" onClick={saveNote} disabled={saving} className="px-3 py-1.5 text-xs">
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
                  </Button>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-base font-bold text-white placeholder-slate-600 outline-none focus:border-sky-500"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note, reminders, or code snippets… (Markdown supported)"
                  rows={14}
                  className="w-full flex-1 resize-none rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 font-mono text-sm leading-relaxed text-slate-200 placeholder-slate-600 outline-none focus:border-sky-500"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/80 text-slate-500">
                <NotebookPen className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">Select a note to edit</p>
              <p className="mt-1 text-xs text-slate-500">Or create a new one with the + button.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function ProfilePanel() {
  const { user } = useAuth();
  if (!user) return <ErrorState message="No user session." />;

  const fullName: string = user.user_metadata?.full_name ?? '—';
  const avatarUrl: string | undefined = user.user_metadata?.avatar_url;
  const email = user.email ?? '—';
  const rollNo: string = user.user_metadata?.roll_number ?? 'Not set';
  const department: string = user.user_metadata?.department ?? 'Not set';
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  const rows: { label: string; value: string }[] = [
    { label: 'Full Name', value: fullName },
    { label: 'Email', value: email },
    { label: 'Roll Number', value: rollNo },
    { label: 'Department', value: department },
    { label: 'Account Created', value: createdAt },
  ];

  return (
    <div className="max-w-2xl space-y-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="h-16 w-16 rounded-2xl border border-slate-700 object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-lg font-bold text-sky-300">
              {initials(fullName !== '—' ? fullName : email)}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-white">{fullName}</h3>
            <p className="text-sm text-slate-400">{email}</p>
            <Badge tone="sky" className="mt-1.5"><UserCircle className="h-3 w-3" /> Student</Badge>
          </div>
        </div>
      </Card>

      <Card className="p-0">
        <div className="divide-y divide-slate-800">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <span className="text-sm text-slate-500">{r.label}</span>
              <span className="text-sm font-semibold text-slate-200">{r.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-xs text-slate-600">
        Profile details like Roll Number and Department come from your sign-in metadata. Contact your administrator to update them.
      </p>
    </div>
  );
}
