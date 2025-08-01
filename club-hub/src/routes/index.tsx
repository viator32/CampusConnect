import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import ExplorePage      from '../features/clubs/pages/ExplorePage';
import ClubDetailPage   from '../features/clubs/pages/ClubDetailPage';
import FeedPage         from '../features/feed/pages/FeedPage';
import ProfilePage      from '../features/profile/pages/ProfilePage';
import SettingsPage     from '../features/settings/pages/SettingsPage';
import SupportPage      from '../features/support/SupportPage';
import LoginPage        from '../features/auth/pages/LoginPage';
import RegisterPage     from '../features/auth/pages/RegisterPage';
import MyClubsPage from '../features/clubs/pages/MyClubsPage';
import BookmarksPage from '../features/bookmarks/pages/BookmarksPage';
import NotificationsPage from '../features/notifications/pages/NotificationsPage';
import AdminPage        from '../features/admin/pages/AdminPage';
import ManageUsersPage from '../features/admin/pages/ManageUsersPage';
import AnalyticsPage from '../features/admin/pages/AnalyticsPage';
import ModerationPage from '../features/admin/pages/ModerationPage';


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/"                    element={<Navigate to="/explore" replace />} />
          <Route path="/login"               element={<LoginPage />} />
          <Route path="/register"            element={<RegisterPage />} />
          <Route path="/explore"             element={<ExplorePage />} />
            <Route path="/clubs/:clubId"       element={<ClubDetailPage />} />
            <Route path="/feed"                element={<FeedPage />} />
            <Route path="/profile"             element={<ProfilePage />} />
            <Route path="/settings"            element={<SettingsPage />} />
            <Route path="/support"             element={<SupportPage />} /> 
            <Route path="/my-clubs"            element={<MyClubsPage />} />
            <Route path="/bookmarks"           element={<BookmarksPage />} />
            <Route path="/notifications"       element={<NotificationsPage />} />
            <Route path="/admin"               element={<AdminPage />} />
              <Route path="/admin/users" element={<ManageUsersPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/moderation" element={<ModerationPage />} />
            {/* Redirect any unknown routes to explore */}
            <Route path="*" element={<Navigate to="/explore" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
