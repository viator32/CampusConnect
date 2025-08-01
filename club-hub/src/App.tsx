import React from 'react';
import AppRoutes from './routes';
import { ProfileProvider } from './features/profile/hooks/useProfile';
import { AuthProvider } from './features/auth/hooks/useAuth';

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppRoutes />
      </ProfileProvider>
    </AuthProvider>
  );
}
