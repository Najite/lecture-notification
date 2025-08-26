export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'lecturer' | 'admin';
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  course_code: string;
  description: string;
  lecturer_id: string;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  course_id: string;
  scheduled_at: string;
  duration_minutes: number;
  location: string | null;
  meeting_url: string | null;
  is_cancelled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  is_active: boolean;
}