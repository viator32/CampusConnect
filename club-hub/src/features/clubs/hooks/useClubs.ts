import { useEffect, useState } from 'react';
import { Club } from '../types';
import { clubService } from '../services/ClubService';

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  
  useEffect(() => {
    clubService.getAll().then(setClubs);
  }, []);
  
  /** locally adds a club; later you can call clubService.create() too */
  const addClub = (newClub: Club) => {
    setClubs(prev => [...prev, newClub]);
  };

  return { clubs, addClub };
}
