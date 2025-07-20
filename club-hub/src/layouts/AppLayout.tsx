// src/layouts/AppLayout.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  TrendingUp,
  Home,
  Bookmark,
  Users,
  Bell,
  Settings,
  HelpCircle,
  Shield,
  User as UserIcon
} from 'lucide-react';
import { useProfile } from '../features/profile/hooks/useProfile';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useProfile();

  const sidebarItems = [
    { path: '/explore',       label: 'Explore',           icon: TrendingUp },
    { path: '/feed',          label: 'Feed',              icon: Home },
    { path: '/bookmarks',     label: 'Bookmarks',         icon: Bookmark },
    { path: '/my-clubs',      label: 'My Clubs',          icon: Users },
    { path: '/notifications', label: 'Notifications',     icon: Bell },
    { path: '/settings',      label: 'Settings',          icon: Settings },
    { path: '/support',       label: 'Support & Feedback',icon: HelpCircle },
    // only show admin if role is 'admin' or 'moderator'
    ...(user && (user.role === 'admin' || user.role === 'moderator')
      ? [{ path: '/admin',    label: 'Admin',             icon: Shield }]
      : []),
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold">CampusConnect</h1>
          <p className="text-sm text-gray-600">University Clubs Platform</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sidebarItems.map(item => {
            const Icon     = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left font-medium
                  ${isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {user && (
          <div
            className="p-4 border-t border-gray-200 cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">Student</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>
    </div>
  );
}
