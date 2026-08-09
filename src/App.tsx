import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { AuthScreen } from '@/components/AuthScreen';
import { AppLayout } from '@/components/AppLayout';
import { type TabId } from '@/components/nav';
import { OverviewView } from '@/views/OverviewView';
import { TimetableView } from '@/views/TimetableView';
import { FacultyView } from '@/views/FacultyView';
import { EventsView } from '@/views/EventsView';
import { ResourcesView } from '@/views/ResourcesView';
import { AssignmentsView } from '@/views/AssignmentsView';
import { NoticesView } from '@/views/NoticesView';
import { CommunityView } from '@/views/CommunityView';
import { NotesView, ProfileView } from '@/views/WorkspaceView';
import { GraduationCap, Loader2 } from 'lucide-react';

function AuthedApp() {
  const [tab, setTab] = useState<TabId>('overview');

  return (
    <AppLayout active={tab} onNavigate={setTab} theme="dark" onToggleTheme={() => {}}>
      {tab === 'overview' && <OverviewView onNavigate={setTab} />}
      {tab === 'timetable' && <TimetableView />}
      {tab === 'faculty' && <FacultyView />}
      {tab === 'events' && <EventsView />}
      {/*tab === 'resources' && <ResourcesView />*/}
      {/*tab === 'assignments' && <AssignmentsView />*/}
      {tab === 'notices' && <NoticesView />}
      {tab === 'community' && <CommunityView />}
      {/*tab === 'notes' && <NotesView />*/}
      {tab === 'profile' && <ProfileView />}
    </AppLayout>
  );
}

function ConfigBanner() {
  if (isSupabaseConfigured) return null;
  return (
    <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-center text-xs text-amber-300 backdrop-blur-md">
      Supabase environment variables are missing — sign-in and data won't work until configured.
    </div>
  );
}

function Gate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b0f19] text-slate-100">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
          <GraduationCap className="h-6 w-6 text-indigo-400" />
        </div>
        <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
        <p className="mt-3 text-sm text-slate-400">Loading Class Hub…</p>
      </div>
    );
  }

  if (!user) return <AuthScreen />;
  return <AuthedApp />;
}

export default function App() {
  useEffect(() => {
    document.title = 'Class Hub — Academic Command Center';
    // Force dark class on root document
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <AuthProvider>
      {/* Locked to permanent dark mode classes */}
      <div className="theme-dark dark min-h-screen bg-[#0b0f19] text-slate-100">
        <ConfigBanner />
        <Gate />
      </div>
    </AuthProvider>
  );
}