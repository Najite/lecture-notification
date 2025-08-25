import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Lecture, Course, Enrollment } from '../types';
import { Calendar, Clock, MapPin, Users, BookOpen, Bell, TrendingUp } from 'lucide-react';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

export function Dashboard() {
  const { user } = useAuth();
  const [upcomingLectures, setUpcomingLectures] = useState<Lecture[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLectures: 0,
    totalStudents: 0,
    upcomingToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (user?.role === 'student') {
        await fetchStudentData();
      } else if (user?.role === 'lecturer') {
        await fetchLecturerData();
      } else if (user?.role === 'admin') {
        await fetchAdminData();
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentData = async () => {
    // Get enrolled courses
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select(`
        course:courses(
          id,
          name,
          code,
          lecturer:users(full_name)
        )
      `)
      .eq('student_id', user?.id);

    const courseIds = enrollments?.map(e => e.course.id) || [];

    // Get upcoming lectures for enrolled courses
    const { data: lectures } = await supabase
      .from('lectures')
      .select(`
        *,
        course:courses(name, code),
        lecturer:users(full_name)
      `)
      .in('course_id', courseIds)
      .gte('scheduled_at', new Date().toISOString())
      .eq('is_cancelled', false)
      .order('scheduled_at', { ascending: true })
      .limit(5);

    setUpcomingLectures(lectures || []);
    
    const todayLectures = lectures?.filter(l => 
      isToday(new Date(l.scheduled_at))
    ).length || 0;

    setStats({
      totalCourses: enrollments?.length || 0,
      totalLectures: lectures?.length || 0,
      totalStudents: 0,
      upcomingToday: todayLectures,
    });
  };

  const fetchLecturerData = async () => {
    // Get lecturer's courses
    const { data: courses } = await supabase
      .from('courses')
      .select('*')
      .eq('lecturer_id', user?.id);

    const courseIds = courses?.map(c => c.id) || [];

    // Get upcoming lectures
    const { data: lectures } = await supabase
      .from('lectures')
      .select(`
        *,
        course:courses(name, code)
      `)
      .in('course_id', courseIds)
      .gte('scheduled_at', new Date().toISOString())
      .eq('is_cancelled', false)
      .order('scheduled_at', { ascending: true })
      .limit(5);

    // Get total enrolled students
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('id')
      .in('course_id', courseIds);

    setUpcomingLectures(lectures || []);
    
    const todayLectures = lectures?.filter(l => 
      isToday(new Date(l.scheduled_at))
    ).length || 0;

    setStats({
      totalCourses: courses?.length || 0,
      totalLectures: lectures?.length || 0,
      totalStudents: enrollments?.length || 0,
      upcomingToday: todayLectures,
    });
  };

  const fetchAdminData = async () => {
    // Get all courses
    const { data: courses } = await supabase
      .from('courses')
      .select('*');

    // Get all upcoming lectures
    const { data: lectures } = await supabase
      .from('lectures')
      .select(`
        *,
        course:courses(name, code),
        lecturer:users(full_name)
      `)
      .gte('scheduled_at', new Date().toISOString())
      .eq('is_cancelled', false)
      .order('scheduled_at', { ascending: true })
      .limit(5);

    // Get total students
    const { data: students } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'student');

    setUpcomingLectures(lectures || []);
    
    const todayLectures = lectures?.filter(l => 
      isToday(new Date(l.scheduled_at))
    ).length || 0;

    setStats({
      totalCourses: courses?.length || 0,
      totalLectures: lectures?.length || 0,
      totalStudents: students?.length || 0,
      upcomingToday: todayLectures,
    });
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd');
  };

  const getStatCards = () => {
    const baseCards = [
      {
        title: 'Total Courses',
        value: stats.totalCourses,
        icon: BookOpen,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
      },
      {
        title: 'Upcoming Lectures',
        value: stats.totalLectures,
        icon: Calendar,
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
      },
      {
        title: 'Today\'s Lectures',
        value: stats.upcomingToday,
        icon: Bell,
        color: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-600',
      },
    ];

    if (user?.role === 'lecturer' || user?.role === 'admin') {
      baseCards.push({
        title: user.role === 'admin' ? 'Total Students' : 'My Students',
        value: stats.totalStudents,
        icon: Users,
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
      });
    }

    return baseCards;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const statCards = getStatCards();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your lectures today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Lectures */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Lectures</h2>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>

        {upcomingLectures.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming lectures scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingLectures.map((lecture) => (
              <div
                key={lecture.id}
                className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg hover:from-purple-100 hover:to-blue-100 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {lecture.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {lecture.course?.name} ({lecture.course?.code})
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {getDateLabel(new Date(lecture.scheduled_at))} at{' '}
                        {format(new Date(lecture.scheduled_at), 'HH:mm')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{lecture.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {lecture.duration_minutes} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}