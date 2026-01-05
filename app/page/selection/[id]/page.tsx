'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSelectionById } from '@/app/services/selections/selectionApi';
import { TrackType } from '@/app/sharedTypes/sharedTypes';
import Bar from '@/app/components/Bar/Bar';
import MainNav from '@/app/components/MainNav/MainNav';
import MainSidebar from '@/app/components/MainSidebar/MainSidebar';
import Centerblock from '@/app/components/Centerblock/Centerblock';
import styles from '@/app/page.module.css';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { setAllTracks } from '@/app/store/features/trackSlice';
import { getAllTracks } from '@/app/services/traks/trackApi';

// Интерфейс для типизации ошибок
interface ApiError extends Error {
  message: string;
}

export default function SelectionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const allTracks = useAppSelector((state) => state.tracks.allTracks);

  const id = Number(params.id);
  const altName = searchParams.get('name') || 'Подборка';

  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [selectionName, setSelectionName] = useState<string>(altName);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSelection();
  }, [router, id]);

  const loadSelection = async () => {
    try {
      setLoading(true);
      let currentAllTracks = allTracks;
      if (currentAllTracks.length === 0) {
        const tracksData = await getAllTracks();
        dispatch(setAllTracks(tracksData));
        currentAllTracks = tracksData;
      }

      const selection = await getSelectionById(id);
      setSelectionName(selection.name || altName);

      if (selection.items && Array.isArray(selection.items)) {
        const firstItem = selection.items[0];

        if (typeof firstItem === 'number') {
          const tracksIds = selection.items;
          const filteredTracks = currentAllTracks.filter((track) =>
            tracksIds.includes(track._id),
          );
          setTracks(filteredTracks);
        } else if (
          firstItem &&
          typeof firstItem === 'object' &&
          firstItem._id
        ) {
          setTracks(selection.items as TrackType[]);
        } else {
          setTracks([]);
        }
      } else {
        setTracks([]);
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      console.error('Ошибка загрузки подборки:', error);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <main className={styles.main}>
            <MainNav />
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2 style={{ color: 'white' }}>Загрузка подборки...</h2>
            </div>
            <MainSidebar />
          </main>
          <Bar />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <MainNav />
          <Centerblock tracks={tracks} title={selectionName} />
          <MainSidebar />
        </main>
        <Bar />
      </div>
    </div>
  );
}
