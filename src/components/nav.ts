import {
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  type LucideIcon,
  Megaphone,
  MessageCircle,
  Trophy,
  UserCircle,
  Users,
} from 'lucide-react';

export type TabId =
  | 'overview'
  | 'timetable'
  | 'faculty'
  | 'events'
  | 'resources'
  | 'assignments'
  | 'notices'
  | 'community'
  | 'notes'
  | 'profile';

export type NavItem = {
  id: TabId;
  label: string;
  short: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', short: 'Home', icon: LayoutDashboard },
  { id: 'timetable', label: 'Timetable', short: 'Schedule', icon: CalendarDays },
  { id: 'faculty', label: 'Faculty', short: 'Faculty', icon: Users },
  { id: 'events', label: 'Events', short: 'Events', icon: Trophy },
  // { id: 'resources', label: 'Resources', short: 'Locker', icon: FileText },
  // { id: 'assignments', label: 'Assignments', short: 'Tasks', icon: ClipboardList },
  { id: 'notices', label: 'Notices', short: 'Notices', icon: Megaphone },
  { id: 'community', label: 'Community', short: 'Groups', icon: MessageCircle },
  // { id: 'notes', label: 'My Notes', short: 'Notes', icon: NotebookPen },
  { id: 'profile', label: 'Profile', short: 'Profile', icon: UserCircle },
];

export const BRAND = {
  name: 'Class Hub',
  icon: GraduationCap,
};