import { useState, useEffect } from 'react';
import {
  getSelectionById,
  SelectionType,
} from '../services/selections/selectionApi';
import { TrackType } from '../sharedTypes/sharedTypes';

// Интерфейс для типизации ошибок
interface ApiError extends Error {
  message: string;
}

export const useSelection = (id: number) => {
  const [selection, setSelection] = useState<SelectionType | null>(null);
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadSelection();
    }
  }, [id]);

  const loadSelection = async () => {
    try {
      setLoading(true);
      const data = await getSelectionById(id);
      setSelection(data);

      if (data.tracks && Array.isArray(data.tracks)) {
        setTracks(data.tracks);
      } else {
        setTracks([]);
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.message || 'Ошибка загрузки подборки');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setLoading(true);
    loadSelection();
  };

  return { selection, tracks, loading, error, refresh };
};
