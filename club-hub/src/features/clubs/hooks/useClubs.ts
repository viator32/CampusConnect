import { useEffect, useState } from 'react';
import { Club } from '../types';
import { ClubService } from '../services/ClubService';

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  
  useEffect(() => {
    ClubService.getAll().then(setClubs);
  }, []);
  
  /** locally adds a club; later you can call ClubService.create() too */
  const addClub = (newClub: Club) => {
    setClubs(prev => [...prev, newClub]);
  };

  return { clubs, addClub };
}
