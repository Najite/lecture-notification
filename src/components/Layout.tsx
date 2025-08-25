import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Bell,
  GraduationCap,
  UserCheck,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

export function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
      navigate('/auth');
    }
  };

  const getNavItems = () => {
    const baseItems = [
      { icon: Calendar, label: 'Dashboard', path: '/dashboard' },
      { icon: BookOpen, label: 'Courses', path: '/courses' },
      { icon: Bell, label: 'Lectures', path: '/lectures' },
    ];

    if (user?.role === 'admin') {
      baseItems.push(
        { icon: Users, label: 'Users', path: '/users' },
        { icon: Shield, label: 'Admin Panel', path: '/admin' }
      );
    }

    if (user?.role === 'lecturer') {
      baseItems.push(
        { icon: GraduationCap, label: 'My Courses', path: '/my-courses' }
      );
    }

    if (user?.role === 'student') {
      baseItems.push(
        { icon: UserCheck, label: 'My Enrollments', path: '/enrollments' }
      );
    }

    baseItems.push({ icon: Settings, label: 'Settings', path: '/settings' });

    return baseItems;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'lecturer': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'lecturer': return GraduationCap;
      case 'student': return UserCheck;
      default: return Users;
    }
  };

  if (!user) return <Outlet />;

  const navItems = getNavItems();
  const RoleIcon = getRoleIcon(user.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-xl border-r border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">LectureAlert</h1>
                <p className="text-sm text-gray-500">Notification System</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <RoleIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.full_name}
                </p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 hover:text-purple-700 transition-all duration-200 group"
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}