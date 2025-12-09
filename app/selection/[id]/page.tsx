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
    const user = localStorage.getItem('user');
    // if (!user) {
    //   router.push('/Signin');
    //   return;
    // }

    loadSelection();
  }, [router, id]);

  const loadSelection = async () => {
    try {
      setLoading(true);

      // ВСЕГДА загружаем все треки если их нет или обновляем
      let currentAllTracks = allTracks;
      if (currentAllTracks.length === 0) {
        const tracksData = await getAllTracks();
        dispatch(setAllTracks(tracksData));
        currentAllTracks = tracksData;
      }

      // Получаем подборку
      const selection = await getSelectionById(id);

      // Устанавливаем название
      setSelectionName(selection.name || altName);

      // Обрабатываем items
      if (selection.items && Array.isArray(selection.items)) {
        const firstItem = selection.items[0];

        // Если items содержат ID (числа)
        if (typeof firstItem === 'number') {
          // Фильтруем треки по ID
          const tracksIds = selection.items;
          const filteredTracks = currentAllTracks.filter((track) =>
            tracksIds.includes(track._id),
          );
          setTracks(filteredTracks);
        }
        // Если items содержат объекты треков
        else if (firstItem && typeof firstItem === 'object' && firstItem._id) {
          setTracks(selection.items as TrackType[]);
        } else {
          setTracks([]);
        }
      } else {
        setTracks([]);
      }
    } catch (err: any) {
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
