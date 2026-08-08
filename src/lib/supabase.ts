import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'),
);

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

/* ----------------------------- Database types ---------------------------- */

export type Faculty = {
  id: string;
  name: string;
  designation: string;
  department: string;
  cabin_location: string | null;
  email: string | null;
  whatsapp_number: string | null;
  created_at: string;
};

export type Timetable = {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  subject_name: string;
  subject_code: string;
  room_number: string | null;
  faculty_id: string | null;
  created_at: string;
  faculty?: Faculty | null;
};

export type EventCategory = 'Academic' | 'Cultural' | 'Sports' | 'Hackathon';

export type CollegeEvent = {
  id: string;
  title: string;
  category: EventCategory;
  event_date: string;
  event_time: string | null;
  venue: string | null;
  organizer: string | null;
  registration_link: string | null;
  description: string | null;
  created_at: string;
};

export type NoticePriority = 'Urgent' | 'Exam' | 'General';

export type Notice = {
  id: string;
  title: string;
  priority: NoticePriority;
  content: string;
  date_posted: string;
  created_at: string;
};

export type Resource = {
  id: string;
  subject_name: string;
  unit: number | null;
  title: string;
  file_url: string | null;
  drive_link: string | null;
  created_at: string;
};

export type Assignment = {
  id: string;
  subject_name: string;
  title: string;
  due_date: string;
  description: string | null;
  created_at: string;
};

export type UserAssignment = {
  user_id: string;
  assignment_id: string;
  completed: boolean;
  updated_at: string;
};

export type PersonalNote = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  updated_at: string;
  created_at: string;
};

type Database = Record<string, never>;

