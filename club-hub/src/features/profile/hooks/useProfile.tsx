import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { profileService } from '../services/ProfileService';
import { useAuth } from '../../auth/hooks/useAuth';

type ProfileContextValue = {
  user: User | null;
  updateUser: (u: User) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { token } = useAuth();

  // fetch user whenever token changes
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    let active = true;
    profileService
      .getCurrent()
      .then(u => {
        if (active) setUser(u);
      })
      .catch(() => {
        if (active) setUser(null);
      });
    return () => {
      active = false;
    };
  }, [token]);

  // updateUser calls service then updates context
  const updateUser = async (updated: User) => {
    const saved = await profileService.updateCurrent(updated);
    setUser(saved);
  };

  return (
    <ProfileContext.Provider value={{ user, updateUser }}>
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}
