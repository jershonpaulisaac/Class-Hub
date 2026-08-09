import { useState } from 'react';
import { User, Mail, ShieldCheck, CheckCircle2, Key, Bell, Sparkles, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card, SectionTitle } from '@/components/ui';
import { initials } from '@/lib/utils';

export function ProfileView() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name ?? user?.email ?? 'Student';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle 
        title="Student Identity" 
        subtitle="Manage your personal profile, credentials, and app preferences." 
        icon={<User className="h-5 w-5 text-indigo-400" />} 
      />

      {/* Hero Banner Card */}
      <Card className="relative overflow-hidden border-slate-800 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-6 sm:p-8">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={displayName} 
                className="h-20 w-20 rounded-2xl border-2 border-indigo-500/40 object-cover shadow-xl" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-tr from-indigo-600 to-indigo-800 text-2xl font-black text-white shadow-xl">
                {initials(displayName)}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white sm:text-2xl">{displayName}</h2>
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="mt-0.5 text-sm text-slate-400">{user?.email}</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Verified Student
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-300">
                  <GraduationCap className="h-3.5 w-3.5" /> CSE Department
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCopyId}
            className="self-start sm:self-center shrink-0 rounded-xl border border-slate-700/80 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700/80"
          >
            {copied ? '✓ Copied ID' : 'Copy Student ID'}
          </button>
        </div>
      </Card>

      {/* Grid Stats & Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-4 border-slate-800 bg-[#111827] p-6">
          <h3 className="flex items-center gap-2 text-base font-bold text-white border-b border-slate-800/80 pb-3">
            <Sparkles className="h-4 w-4 text-indigo-400" /> Account Overview
          </h3>

          <div className="space-y-3.5 text-sm">
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" /> Primary Email
              </span>
              <span className="font-semibold text-white truncate max-w-[200px]">{user?.email}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-slate-500" /> Auth Provider
              </span>
              <span className="font-semibold text-indigo-400 capitalize">
                {user?.app_metadata?.provider ?? 'Supabase Auth'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400 flex items-center gap-2">
                <Key className="h-4 w-4 text-slate-500" /> Account Role
              </span>
              <span className="font-semibold text-emerald-400">Student</span>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 border-slate-800 bg-[#111827] p-6">
          <h3 className="flex items-center gap-2 text-base font-bold text-white border-b border-slate-800/80 pb-3">
            <Bell className="h-4 w-4 text-indigo-400" /> App Status & System
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Session Status</span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Active & Synchronized
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Push Notifications</span>
              <span className="font-semibold text-slate-300">Enabled</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Platform Version</span>
              <span className="font-mono text-xs font-semibold text-indigo-400">v3.0.0</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}