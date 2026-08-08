import { ArrowUpRight, ExternalLink, MessageCircle, Send, UserRound } from 'lucide-react';
import { Card, SectionTitle } from '@/components/ui';

type CommunityLink = {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: typeof MessageCircle;
  tone: 'emerald' | 'sky' | 'violet';
};

const LINKS: CommunityLink[] = [
  {
    title: 'Class WhatsApp Group',
    description: 'The main group for day-to-day chat, doubts, and banter with your batch.',
    href: 'https://chat.whatsapp.com/your-class-group',
    cta: 'Open Group',
    icon: MessageCircle,
    tone: 'emerald',
  },
  {
    title: 'Announcement Channel',
    description: 'Broadcast-only channel for official class and college announcements.',
    href: 'https://whatsapp.com/channel/your-announcement-channel',
    cta: 'Join Channel',
    icon: Send,
    tone: 'sky',
  },
  {
    title: 'Student Roster',
    description: 'Directory of all students in your section with contact details.',
    href: 'https://docs.google.com/spreadsheets/your-roster',
    cta: 'View Roster',
    icon: UserRound,
    tone: 'violet',
  },
];

const TONE: Record<CommunityLink['tone'], string> = {
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  sky: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
  violet: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
};

export function CommunityView() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Community Hub" subtitle="One-tap access to class groups and student directory." icon={<MessageCircle className="h-5 w-5" />} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LINKS.map((l, idx) => {
          const Icon = l.icon;
          return (
            <Card key={l.title} hover className="animate-slide-up flex flex-col p-6">
              <div style={{ animationDelay: `${idx * 70}ms` }}>
                <div className={'mb-4 flex h-12 w-12 items-center justify-center rounded-xl border ' + TONE[l.tone]}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{l.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{l.description}</p>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
                >
                  {l.cta} <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="flex items-start gap-3 p-5">
        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
        <p className="text-xs text-slate-500">
          These are placeholder links. Replace the URLs with your actual class group, announcement channel, and roster links.
        </p>
      </Card>
    </div>
  );
}
