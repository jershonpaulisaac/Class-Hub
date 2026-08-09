import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AuthScreen } from '@/components/AuthScreen';
import { AppLayout } from '@/components/AppLayout';
import { type TabId } from '@/components/nav';
import { OverviewView } from '@/views/OverviewView';
import { TimetableView } from '@/views/TimetableView';
import { FacultyView } from '@/views/FacultyView';
import { EventsView } from '@/views/EventsView';
import { NoticesView } from '@/views/NoticesView';
import { CommunityView } from '@/views/CommunityView';
import { ProfileView } from '@/views/ProfileView';
import { GraduationCap, Loader2, ShieldAlert } from 'lucide-react';

function AuthedApp() {
  const [tab, setTab] = useState<TabId>('overview');

  return (
    <AppLayout active={tab} onNavigate={setTab} theme="dark" onToggleTheme={() => {}}>
      {tab === 'overview' && <OverviewView onNavigate={setTab} />}
      {tab === 'timetable' && <TimetableView />}
      {tab === 'faculty' && <FacultyView />}
      {tab === 'events' && <EventsView />}
      {tab === 'notices' && <NoticesView />}
      {tab === 'community' && <CommunityView />}
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
  const { user, loading, signOut } = useAuth();
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [checkingApproval, setCheckingApproval] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function checkApprovalStatus() {
      if (!user) {
        setIsApproved(null);
        setCheckingApproval(false);
        return;
      }

      // Query profiles table for approval flag
      const { data, error } = await supabase
        .from('profiles')
        .select('approved')
        .eq('id', user.id)
        .maybeSingle();

      if (isMounted) {
        if (error || !data) {
          // Default to false if profile record is pending creation
          setIsApproved(false);
        } else {
          setIsApproved(Boolean(data.approved));
        }
        setCheckingApproval(false);
      }
    }

    checkApprovalStatus();
    return () => { isMounted = false; };
  }, [user]);

  if (loading || (user && checkingApproval)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b0f19] text-slate-100">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
          <GraduationCap className="h-6 w-6 text-indigo-400" />
        </div>
        <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
        <p className="mt-3 text-sm text-slate-400">Verifying session access…</p>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  // Pending Admin Approval State
  if (isApproved === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] p-4 text-center">
        <div className="w-full max-w-md space-y-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 text-slate-100 backdrop-blur-xl shadow-2xl">
          <ShieldAlert className="mx-auto h-12 w-12 text-amber-400 animate-pulse" />
          <h2 className="text-xl font-bold text-white">Access Approval Pending</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your Google Account (<span className="text-indigo-300 font-semibold">{user.email}</span>) has been authenticated. Request is waiting for administrator approval.
          </p>
          <div className="pt-2">
            <button
              onClick={() => signOut()}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <AuthedApp />;
}

export default function App() {
  useEffect(() => {
    document.title = 'Class Hub — Academic Command Center';
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <AuthProvider>
      <div className="theme-dark dark min-h-screen bg-[#0b0f19] text-slate-100">
        <ConfigBanner />
        <Gate />
      </div>
    </AuthProvider>
  );
}