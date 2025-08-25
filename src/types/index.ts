export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'lecturer' | 'admin';
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  lecturer_id: string;
  lecturer?: User;
  created_at: string;
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  course_id: string;
  course?: Course;
  lecturer_id: string;
  lecturer?: User;
  scheduled_at: string;
  duration_minutes: number;
  location: string;
  is_cancelled: boolean;
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  student?: User;
  course?: Course;
  enrolled_at: string;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  email_enabled: boolean;
  reminder_hours_before: number;
  created_at: string;
}