import { useEffect, useState } from 'react';
import { Club } from '../types';
import { ClubService } from '../services/ClubService';

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  useEffect(() => {
    ClubService.getAll().then(setClubs);
  }, []);
  return { clubs };
}
