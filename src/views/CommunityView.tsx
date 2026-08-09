import { ArrowUpRight, MessageCircle, Send } from 'lucide-react';
import { Card, SectionTitle } from '@/components/ui';

type CommunityLink = {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: typeof MessageCircle;
  tone: 'emerald' | 'sky';
};

const LINKS: CommunityLink[] = [
  {
    title: 'Class WhatsApp Group',
    description: 'The main group for day-to-day chat, doubts, and banter with your batch.',
    href: 'https://chat.whatsapp.com/KFslQmDh0kfJOqwl7JclYJ?s=cl&p=a&ilr=0',
    cta: 'Open Group',
    icon: MessageCircle,
    tone: 'emerald',
  },
  {
    title: 'Announcement Channel',
    description: 'Broadcast-only channel for official class and college announcements.',
    href: 'https://whatsapp.com/channel/0029VbDTEhV72WTyllxNuu3C',
    cta: 'Join Channel',
    icon: Send,
    tone: 'sky',
  },
];

const TONE: Record<CommunityLink['tone'], string> = {
  emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
  sky: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400',
};

export function CommunityView() {
  return (
    <div className="space-y-6">
      <SectionTitle 
        title="Community Hub" 
        subtitle="One-tap access to class groups and official channels." 
        icon={<MessageCircle className="h-5 w-5" />} 
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
        {LINKS.map((l, idx) => {
          const Icon = l.icon;
          return (
            <Card key={l.title} hover className="animate-slide-up flex flex-col p-6 border-slate-800 bg-[#111827]">
              <div style={{ animationDelay: `${idx * 70}ms` }} className="flex flex-col h-full justify-between">
                <div>
                  <div className={'mb-4 flex h-12 w-12 items-center justify-center rounded-xl border ' + TONE[l.tone]}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{l.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{l.description}</p>
                </div>
                
                <div className="pt-5 mt-4 border-t border-slate-800/60">
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    {l.cta} <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}