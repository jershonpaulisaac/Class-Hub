/*
# Seed sample data for Academic Hub

Populates all shared tables with realistic engineering-class content so the
app is fully demonstrable on first run. Idempotent: only inserts when the
target table is empty.
*/

-- ---------- faculty ----------
INSERT INTO faculty (name, designation, department, cabin_location, email, whatsapp_number)
SELECT * FROM (VALUES
  ('Dr. Ananya Sharma',  'Professor',          'Computer Science', 'A-Block 204', 'ananya.sharma@college.edu', '919876543210'),
  ('Prof. Rajesh Kumar', 'Associate Professor','Electronics',      'B-Block 112', 'rajesh.kumar@college.edu',  '919812345678'),
  ('Dr. Meera Iyer',     'Assistant Professor','Mathematics',      'C-Block 301', 'meera.iyer@college.edu',    '919900112233'),
  ('Prof. Karan Verma',  'Lab Instructor',     'Computer Science', 'Lab 3',       'karan.verma@college.edu',   '919855556666'),
  ('Dr. Sneha Patel',    'Professor',          'Mechanical',       'D-Block 010', 'sneha.patel@college.edu',   '919877778888')
) AS v(name, designation, department, cabin_location, email, whatsapp_number)
WHERE NOT EXISTS (SELECT 1 FROM faculty);

-- ---------- timetable ----------
DO $$
DECLARE
  fid_ananya uuid := (SELECT id FROM faculty WHERE name='Dr. Ananya Sharma');
  fid_rajesh uuid := (SELECT id FROM faculty WHERE name='Prof. Rajesh Kumar');
  fid_meera  uuid := (SELECT id FROM faculty WHERE name='Dr. Meera Iyer');
  fid_karan  uuid := (SELECT id FROM faculty WHERE name='Prof. Karan Verma');
  fid_sneha  uuid := (SELECT id FROM faculty WHERE name='Dr. Sneha Patel');
BEGIN
  IF NOT EXISTS (SELECT 1 FROM timetable) THEN
    INSERT INTO timetable (day_of_week, start_time, end_time, subject_name, subject_code, room_number, faculty_id) VALUES
      (1, '09:00','10:00','Data Structures','CS201','A-101', fid_ananya),
      (1, '10:00','11:00','Digital Electronics','EC202','B-102', fid_rajesh),
      (1, '11:15','12:15','Engineering Mathematics-III','MA203','C-201', fid_meera),
      (1, '14:00','16:00','Data Structures Lab','CS201L','Lab 3', fid_karan),
      (2, '09:00','10:00','Digital Electronics','EC202','B-102', fid_rajesh),
      (2, '10:00','11:00','Thermodynamics','ME205','D-110', fid_sneha),
      (2, '11:15','12:15','Data Structures','CS201','A-101', fid_ananya),
      (2, '14:00','15:00','Engineering Mathematics-III','MA203','C-201', fid_meera),
      (3, '09:00','10:00','Engineering Mathematics-III','MA203','C-201', fid_meera),
      (3, '10:00','11:00','Data Structures','CS201','A-101', fid_ananya),
      (3, '11:15','13:15','Digital Electronics Lab','EC202L','Lab 1', fid_rajesh),
      (4, '09:00','10:00','Thermodynamics','ME205','D-110', fid_sneha),
      (4, '10:00','11:00','Data Structures','CS201','A-101', fid_ananya),
      (4, '11:15','12:15','Digital Electronics','EC202','B-102', fid_rajesh),
      (4, '14:00','16:00','Thermodynamics Lab','ME205L','Lab 2', fid_sneha),
      (5, '09:00','10:00','Data Structures','CS201','A-101', fid_ananya),
      (5, '10:00','11:00','Engineering Mathematics-III','MA203','C-201', fid_meera),
      (5, '11:15','12:15','Digital Electronics','EC202','B-102', fid_rajesh),
      (5, '14:00','15:00','Seminar / Project Work','CS299','Seminar Hall', fid_karan);
  END IF;
END $$;

-- ---------- events ----------
INSERT INTO events (title, category, event_date, event_time, venue, organizer, registration_link, description)
SELECT title, category, event_date::date, event_time::time, venue, organizer, registration_link, description
FROM (VALUES
  ('HackNova 2025',           'Hackathon', '2025-09-20', '09:00', 'Main Auditorium',  'Coding Club',        'https://hacknova.example.com',  '36-hour national hackathon. Build, ship, and win prizes across AI, Web, and hardware tracks.'),
  ('Symposium: AI Frontier',  'Academic',  '2025-09-12', '10:00', 'Seminar Hall',     'Department of CSE',  'https://aifrontier.example.com','Talks from industry leaders on the future of generative AI and agentic systems.'),
  ('Inter-Class Cricket Cup', 'Sports',    '2025-09-28', '16:00', 'College Ground',   'Sports Committee',   'https://sports.example.com',    'Knockout tournament between all engineering sections. Squad of 11 per class.'),
  ('Rangmanch Cultural Night','Cultural',  '2025-10-05', '18:30', 'Open-Air Theatre', 'Cultural Committee', 'https://rangmanch.example.com', 'Music, dance, and drama night. Performances and food stalls open to all students.'),
  ('Web Dev Bootcamp',        'Hackathon', '2025-09-15', '11:00', 'Lab 4',            'GDG Campus',         'https://webdev.example.com',    'Hands-on full-day bootcamp covering React, TypeScript, and deployment basics.')
) AS v(title, category, event_date, event_time, venue, organizer, registration_link, description)
WHERE NOT EXISTS (SELECT 1 FROM events);

-- ---------- notices ----------
INSERT INTO notices (title, priority, content, date_posted)
SELECT title, priority, content, date_posted::date
FROM (VALUES
  ('Mid-Semester Exam Schedule Released',        'Urgent',  'The mid-semester examination timetable has been published on the portal. Exams begin September 25. Please check your subject-wise dates and report clashes by Friday.', '2025-09-08'),
  ('Data Structures Assignment 2 Deadline',      'Exam',    'Assignment 2 (Linked List implementation) is due on September 18. Submit via the course portal before 11:59 PM. Late submissions attract a 10% penalty per day.', '2025-09-07'),
  ('Library Extended Hours During Exams',        'General', 'The central library will remain open until 10 PM from September 20 onwards to support exam preparation. Study rooms can be booked at the front desk.', '2025-09-06')
) AS v(title, priority, content, date_posted)
WHERE NOT EXISTS (SELECT 1 FROM notices);

-- ---------- resources ----------
INSERT INTO resources (subject_name, unit, title, file_url, drive_link)
SELECT subject_name, unit::int, title, file_url, drive_link
FROM (VALUES
  ('Data Structures',             1, 'Arrays & Linked Lists — Notes',      'https://example.com/ds-u1.pdf', 'https://drive.google.com/ds-u1'),
  ('Data Structures',             2, 'Stacks & Queues — Slides',           'https://example.com/ds-u2.pdf', 'https://drive.google.com/ds-u2'),
  ('Data Structures',             3, 'Trees & Graphs — Reference',         'https://example.com/ds-u3.pdf', 'https://drive.google.com/ds-u3'),
  ('Digital Electronics',         1, 'Logic Gates — Lecture Notes',        'https://example.com/ec-u1.pdf', 'https://drive.google.com/ec-u1'),
  ('Digital Electronics',         2, 'Combinational Circuits — Workbook',  'https://example.com/ec-u2.pdf', 'https://drive.google.com/ec-u2'),
  ('Engineering Mathematics-III', 1, 'Laplace Transforms — Formula Sheet', 'https://example.com/ma-u1.pdf', 'https://drive.google.com/ma-u1'),
  ('Engineering Mathematics-III', 2, 'Fourier Series — Problem Set',       'https://example.com/ma-u2.pdf', 'https://drive.google.com/ma-u2'),
  ('Thermodynamics',              1, 'First Law of Thermodynamics — Notes','https://example.com/me-u1.pdf', 'https://drive.google.com/me-u1')
) AS v(subject_name, unit, title, file_url, drive_link)
WHERE NOT EXISTS (SELECT 1 FROM resources);

-- ---------- assignments ----------
INSERT INTO assignments (subject_name, title, due_date, description)
SELECT subject_name, title, due_date::date, description
FROM (VALUES
  ('Data Structures',             'Linked List Implementation',    '2025-09-18', 'Implement singly and doubly linked lists with insertion, deletion, and search operations. Submit code + a short write-up on time complexity.'),
  ('Digital Electronics',         'Combinational Circuit Design',  '2025-09-22', 'Design a 4-bit magnitude comparator using logic gates. Simulate in Logisim and submit the .circ file with a truth table.'),
  ('Engineering Mathematics-III', 'Laplace Transform Problem Set', '2025-09-15', 'Solve problems 1–12 from Chapter 4. Show all working steps. Submission on paper in the department office.'),
  ('Thermodynamics',              'First Law Case Study',          '2025-09-25', 'Analyze a real-world heat engine using the first law. 2-page report with assumptions and efficiency calculation.'),
  ('Data Structures',             'Graph Traversal Lab',           '2025-09-30', 'Implement BFS and DFS for a given adjacency list. Include test cases for connected and disconnected graphs.')
) AS v(subject_name, title, due_date, description)
WHERE NOT EXISTS (SELECT 1 FROM assignments);
