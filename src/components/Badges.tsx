import { AlertCircle, BadgeCheck } from 'lucide-react';
import type { Notice } from '@/lib/supabase';
import { Badge } from '@/components/ui';

export function PriorityBadge({ priority }: { priority: Notice['priority'] }) {
  const tone = priority === 'Urgent' ? 'rose' : priority === 'Exam' ? 'amber' : 'slate';
  return (
    <Badge tone={tone}>
      {priority === 'Urgent' && <AlertCircle className="h-3 w-3" />}
      {priority}
    </Badge>
  );
}

export function CountdownBadge({ days }: { days: number }) {
  if (days < 0) return <Badge tone="slate">Overdue</Badge>;
  if (days === 0) return <Badge tone="rose">Due today</Badge>;
  if (days === 1) return <Badge tone="rose">1 day left</Badge>;
  if (days <= 3) return <Badge tone="amber">{days}d left</Badge>;
  return <Badge tone="emerald">{days}d left</Badge>;
}

export function DoneBadge() {
  return (
    <Badge tone="emerald">
      <BadgeCheck className="h-3 w-3" /> Done
    </Badge>
  );
}
