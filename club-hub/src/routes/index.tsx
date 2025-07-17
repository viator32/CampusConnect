import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import ExplorePage from '../features/clubs/pages/ExplorePage';
import ClubDetailPage from '../features/clubs/pages/ClubDetailPage';
import FeedPage from '../features/feed/pages/FeedPage';
import ProfilePage from '../features/profile/pages/ProfilePage';
import SettingsPage from '../features/settings/pages/SettingsPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/explore" replace />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/clubs/:clubId" element={<ClubDetailPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
