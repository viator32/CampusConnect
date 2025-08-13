import { useEffect, useState } from 'react';
import { Club } from '../types';
import { clubService } from '../services/ClubService';

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    clubService
      .getAll()
      .then(setClubs)
      .catch(err => setError(err.message ?? 'Failed to load clubs'))
      .finally(() => setLoading(false));
  }, []);
  
  /** locally adds a club; later you can call clubService.create() too */
  const addClub = (newClub: Club) => {
    setClubs(prev => [...prev, newClub]);
  };

  const joinClub = (id: number) => {
    setError(null);
    setClubs(prev =>
      prev.map(c =>
        c.id === id ? { ...c, isJoined: true, members: c.members + 1 } : c
      )
    );
    clubService.joinClub(id).catch(err => {
      setClubs(prev =>
        prev.map(c =>
          c.id === id
            ? { ...c, isJoined: false, members: Math.max(0, c.members - 1) }
            : c
        )
      );
      setError(err.message ?? 'Failed to join club');
    });
  };

  const leaveClub = (id: number) => {
    setError(null);
    setClubs(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, isJoined: false, members: Math.max(0, c.members - 1) }
          : c
      )
    );
    clubService.leaveClub(id).catch(err => {
      setClubs(prev =>
        prev.map(c =>
          c.id === id ? { ...c, isJoined: true, members: c.members + 1 } : c
        )
      );
      setError(err.message ?? 'Failed to leave club');
    });
  };

  return { clubs, addClub, joinClub, leaveClub, loading, error };
}
