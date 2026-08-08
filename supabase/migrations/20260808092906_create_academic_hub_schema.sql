/*
# Academic Class & Event Hub — Schema

## Purpose
A shared academic hub for a single class of engineering students: class timetable,
faculty directory, events, notices, study resources, assignments, and per-user
private notes + assignment completion tracking.

## Tables created
1. faculty — shared class directory (professors / lab instructors)
2. timetable — weekly class schedule (Mon–Fri), linked to faculty
3. events — college activities (hackathons, cultural, sports, academic)
4. notices — announcements with priority tags
5. resources — subject/unit study documents with Drive links
6. assignments — official class assignments with due dates
7. user_assignments — private per-user completion state (owner-scoped)
8. personal_notes — private per-user markdown notebook (owner-scoped)

## Data sharing model
- faculty, timetable, events, notices, resources, assignments = SHARED.
  Every signed-in student sees the same rows. Policies are TO authenticated
  with a permissive predicate (true) because the data is intentionally shared
  among the whole class and is managed centrally (not user-generated).
- user_assignments, personal_notes = PRIVATE (owner-scoped via auth.uid()).

## Security
- RLS enabled on every table.
- Shared tables: SELECT for authenticated; INSERT/UPDATE/DELETE for authenticated
  (class members may add/edit class content). No anon access (app requires sign-in).
- Private tables: full owner-scoped CRUD restricted to auth.uid() = user_id.
- user_assignments.user_id and personal_notes.user_id default to auth.uid()
  so inserts that omit user_id still satisfy WITH CHECK.

## Notes
- Uses gen_random_uuid() for all primary keys.
- Foreign keys: timetable.faculty_id -> faculty(id) ON DELETE SET NULL.
- user_assignments has a composite PK (user_id, assignment_id) to prevent
  duplicate completion rows per user per assignment.
*/

-- =========================================================
-- faculty
-- =========================================================
CREATE TABLE IF NOT EXISTS faculty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  designation text NOT NULL,
  department text NOT NULL,
  cabin_location text,
  email text,
  whatsapp_number text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_select_faculty" ON faculty;
CREATE POLICY "auth_select_faculty" ON faculty FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_faculty" ON faculty;
CREATE POLICY "auth_insert_faculty" ON faculty FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_faculty" ON faculty;
CREATE POLICY "auth_update_faculty" ON faculty FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_faculty" ON faculty;
CREATE POLICY "auth_delete_faculty" ON faculty FOR DELETE TO authenticated USING (true);

-- =========================================================
-- timetable
-- =========================================================
CREATE TABLE IF NOT EXISTS timetable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  subject_name text NOT NULL,
  subject_code text NOT NULL,
  room_number text,
  faculty_id uuid REFERENCES faculty(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_select_timetable" ON timetable;
CREATE POLICY "auth_select_timetable" ON timetable FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_timetable" ON timetable;
CREATE POLICY "auth_insert_timetable" ON timetable FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_timetable" ON timetable;
CREATE POLICY "auth_update_timetable" ON timetable FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_timetable" ON timetable;
CREATE POLICY "auth_delete_timetable" ON timetable FOR DELETE TO authenticated USING (true);

-- =========================================================
-- events
-- =========================================================
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('Academic','Cultural','Sports','Hackathon')),
  event_date date NOT NULL,
  event_time time,
  venue text,
  organizer text,
  registration_link text,
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_select_events" ON events;
CREATE POLICY "auth_select_events" ON events FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_events" ON events;
CREATE POLICY "auth_insert_events" ON events FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_events" ON events;
CREATE POLICY "auth_update_events" ON events FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_events" ON events;
CREATE POLICY "auth_delete_events" ON events FOR DELETE TO authenticated USING (true);

-- =========================================================
-- notices
-- =========================================================
CREATE TABLE IF NOT EXISTS notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('Urgent','Exam','General')),
  content text NOT NULL,
  date_posted date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_select_notices" ON notices;
CREATE POLICY "auth_select_notices" ON notices FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_notices" ON notices;
CREATE POLICY "auth_insert_notices" ON notices FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_notices" ON notices;
CREATE POLICY "auth_update_notices" ON notices FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_notices" ON notices;
CREATE POLICY "auth_delete_notices" ON notices FOR DELETE TO authenticated USING (true);

-- =========================================================
-- resources
-- =========================================================
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_name text NOT NULL,
  unit integer,
  title text NOT NULL,
  file_url text,
  drive_link text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_select_resources" ON resources;
CREATE POLICY "auth_select_resources" ON resources FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_resources" ON resources;
CREATE POLICY "auth_insert_resources" ON resources FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_resources" ON resources;
CREATE POLICY "auth_update_resources" ON resources FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_resources" ON resources;
CREATE POLICY "auth_delete_resources" ON resources FOR DELETE TO authenticated USING (true);

-- =========================================================
-- assignments
-- =========================================================
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_name text NOT NULL,
  title text NOT NULL,
  due_date date NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_select_assignments" ON assignments;
CREATE POLICY "auth_select_assignments" ON assignments FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_assignments" ON assignments;
CREATE POLICY "auth_insert_assignments" ON assignments FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_assignments" ON assignments;
CREATE POLICY "auth_update_assignments" ON assignments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_assignments" ON assignments;
CREATE POLICY "auth_delete_assignments" ON assignments FOR DELETE TO authenticated USING (true);

-- =========================================================
-- user_assignments — private per-user completion state
-- Composite PK (user_id, assignment_id) prevents duplicates.
-- =========================================================
CREATE TABLE IF NOT EXISTS user_assignments (
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, assignment_id)
);
ALTER TABLE user_assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_user_assignments" ON user_assignments;
CREATE POLICY "select_own_user_assignments" ON user_assignments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_user_assignments" ON user_assignments;
CREATE POLICY "insert_own_user_assignments" ON user_assignments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_user_assignments" ON user_assignments;
CREATE POLICY "update_own_user_assignments" ON user_assignments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_user_assignments" ON user_assignments;
CREATE POLICY "delete_own_user_assignments" ON user_assignments
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =========================================================
-- personal_notes — private per-user notebook
-- =========================================================
CREATE TABLE IF NOT EXISTS personal_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE personal_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_notes" ON personal_notes;
CREATE POLICY "select_own_notes" ON personal_notes
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_notes" ON personal_notes;
CREATE POLICY "insert_own_notes" ON personal_notes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_notes" ON personal_notes;
CREATE POLICY "update_own_notes" ON personal_notes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_notes" ON personal_notes;
CREATE POLICY "delete_own_notes" ON personal_notes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =========================================================
-- Indexes for common queries
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_timetable_day ON timetable(day_of_week, start_time);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_notices_date ON notices(date_posted DESC);
CREATE INDEX IF NOT EXISTS idx_assignments_due ON assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_user_assignments_user ON user_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_notes_user ON personal_notes(user_id, updated_at DESC);
