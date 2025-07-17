import React from 'react';
import AppRoutes from './routes';
import { ProfileProvider } from './features/profile/hooks/useProfile';

export default function App() {
  return (
    <ProfileProvider>
      <AppRoutes />
    </ProfileProvider>
  );
}
