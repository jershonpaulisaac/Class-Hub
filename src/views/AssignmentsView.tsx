import { useCallback, useEffect, useState } from 'react';
import { Check, ClipboardList, Circle, Loader2 } from 'lucide-react';
import { supabase, type Assignment, type UserAssignment } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { daysUntil, formatDate } from '@/lib/utils';
import { Card, EmptyState, ErrorState, LoadingState, SectionTitle } from '@/components/ui';
import { CountdownBadge, DoneBadge } from '@/components/Badges';

export function AssignmentsView() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [aRes, uRes] = await Promise.all([
      supabase.from('assignments').select('*').order('due_date'),
      user
        ? supabase.from('user_assignments').select('assignment_id, completed').eq('user_id', user.id)
        : Promise.resolve<{ data: UserAssignment[] | null; error: null }>({ data: null, error: null }),
    ]);
    if (aRes.error) { setError(aRes.error.message); return; }
    if (uRes.error) { setError(uRes.error.message); return; }
    setAssignments(aRes.data);
    const map: Record<string, boolean> = {};
    (uRes.data ?? []).forEach((ua) => { map[ua.assignment_id] = ua.completed; });
    setCompleted(map);
    setError(null);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (assignmentId: string) => {
    if (!user) return;
    const newState = !completed[assignmentId];
    setToggling(assignmentId);
    setCompleted((prev) => ({ ...prev, [assignmentId]: newState }));
    const { error } = await supabase
      .from('user_assignments')
      .upsert(
        { user_id: user.id, assignment_id: assignmentId, completed: newState, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,assignment_id' },
      );
    if (error) {
      setCompleted((prev) => ({ ...prev, [assignmentId]: !newState }));
      setError(error.message);
    }
    setToggling(null);
  };

  if (error && assignments === null) return <ErrorState message={error} />;
  if (assignments === null) return <LoadingState label="Loading assignments…" />;

  const sorted = [...assignments].sort((a, b) => {
    const aDone = completed[a.id];
    const bDone = completed[b.id];
    if (aDone === bDone) return a.due_date.localeCompare(b.due_date);
    return aDone ? 1 : -1;
  });
  const pendingCount = assignments.filter((a) => !completed[a.id]).length;

  return (
    <div className="space-y-6">
      <SectionTitle title="Assignment Tracker" subtitle={`${pendingCount} pending · ${assignments.length - pendingCount} completed`} icon={<ClipboardList className="h-5 w-5" />} />

      {error && <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</p>}

      {sorted.length === 0 ? (
        <EmptyState title="No assignments yet" message="New assignments will appear here." icon={<ClipboardList className="h-6 w-6" />} />
      ) : (
        <div className="space-y-3">
          {sorted.map((a, idx) => {
            const isDone = !!completed[a.id];
            const days = daysUntil(a.due_date);
            const isBusy = toggling === a.id;
            return (
              <Card key={a.id} hover className={'animate-slide-up transition ' + (isDone ? 'opacity-60' : '')}>
                <div style={{ animationDelay: `${idx * 50}ms` }} className="flex items-start gap-4 p-5">
                  <button
                    onClick={() => toggle(a.id)}
                    disabled={isBusy}
                    title={isDone ? 'Mark as not done' : 'Mark as completed'}
                    className={
                      'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ' +
                      (isDone ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-600 text-transparent hover:border-sky-400 hover:text-sky-400/40')
                    }
                  >
                    {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-300" /> : isDone ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3 w-3" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className={'text-base font-bold ' + (isDone ? 'text-slate-500 line-through' : 'text-white')}>{a.title}</h3>
                      {isDone ? <DoneBadge /> : <CountdownBadge days={days} />}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{a.subject_name}</p>
                    {a.description && <p className="mt-2 text-sm leading-relaxed text-slate-400">{a.description}</p>}
                    <p className="mt-2 text-[11px] text-slate-500">Due {formatDate(a.due_date)}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
