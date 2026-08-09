import {
  CalendarDays,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  type LucideIcon,
  Megaphone,
  MessageCircle,
  NotebookPen,
  Trophy,
  Users,
  UserCircle
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
  | 'notes'    // 👈 Added
  | 'profile';  // 👈 Added

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
  //{ id: 'resources', label: 'Resources', short: 'Locker', icon: FileText },
  //{ id: 'assignments', label: 'Assignments', short: 'Tasks', icon: ClipboardList },
  { id: 'notices', label: 'Notices', short: 'Notices', icon: Megaphone },
  { id: 'community', label: 'Community', short: 'Groups', icon: MessageCircle },
 // { id: 'notes', label: 'My Notes', short: 'Notes', icon: NotebookPen },    // 👈 Added short
  { id: 'profile', label: 'Profile', short: 'Profile', icon: UserCircle },   // 👈 Added short
];

export const BRAND = {
  name: 'Class Hub',
  icon: GraduationCap,
};