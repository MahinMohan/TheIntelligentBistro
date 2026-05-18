import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { menuItems as localMenu } from '../data/menu';
import { fetchMenu } from '../api/client';

interface UseMenuResult {
  menu: MenuItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMenu(): UseMenuResult {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMenu();
      setMenu(data);
    } catch {
      // Fall back to local data if the backend is unreachable
      setMenu(localMenu);
      setError('Using local menu data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { menu, loading, error, refetch: load };
}
