export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'student' | 'lecturer' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: 'student' | 'lecturer' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'student' | 'lecturer' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          course_code: string
          lecturer_id: string
          color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          course_code: string
          lecturer_id: string
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          course_code?: string
          lecturer_id?: string
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      lectures: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          scheduled_at: string
          duration_minutes: number
          location: string | null
          meeting_url: string | null
          is_cancelled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          scheduled_at: string
          duration_minutes?: number
          location?: string | null
          meeting_url?: string | null
          is_cancelled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          scheduled_at?: string
          duration_minutes?: number
          location?: string | null
          meeting_url?: string | null
          is_cancelled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          enrolled_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          enrolled_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          enrolled_at?: string
          is_active?: boolean
        }
      }
      notifications: {
        Row: {
          id: string
          lecture_id: string
          recipient_id: string
          email: string
          subject: string
          message: string
          status: 'pending' | 'sent' | 'failed'
          scheduled_for: string
          sent_at: string | null
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lecture_id: string
          recipient_id: string
          email: string
          subject: string
          message: string
          status?: 'pending' | 'sent' | 'failed'
          scheduled_for: string
          sent_at?: string | null
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lecture_id?: string
          recipient_id?: string
          email?: string
          subject?: string
          message?: string
          status?: 'pending' | 'sent' | 'failed'
          scheduled_for?: string
          sent_at?: string | null
          error_message?: string | null
          created_at?: string
        }
      }
    }
  }
}