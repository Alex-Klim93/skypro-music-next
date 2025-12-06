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
import { useAppDispatch } from '@/app/store/store';
import { setAllTracks } from '@/app/store/features/trackSlice';

export default function SelectionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const id = Number(params.id);

  // Получаем название из query параметра
  const altName = searchParams.get('name') || 'Подборка';

  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [selectionName, setSelectionName] = useState<string>(altName);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/Signin');
      return;
    }

    loadSelection();
  }, [router, id]);

  const loadSelection = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Загрузка подборки с ID:', id);
      const data = await getSelectionById(id);

      // Получаем треки из подборки - используем все возможные поля
      let selectionTracks: TrackType[] = [];

      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        selectionTracks = data.items;
        console.log('Треки найдены в поле items:', selectionTracks.length);
      } else if (
        data.tracks &&
        Array.isArray(data.tracks) &&
        data.tracks.length > 0
      ) {
        selectionTracks = data.tracks;
        console.log('Треки найдены в поле tracks:', selectionTracks.length);
      } else if (Array.isArray(data) && data.length > 0) {
        // Если API возвращает массив напрямую
        selectionTracks = data;
        console.log(
          'Треки найдены в корневом массиве:',
          selectionTracks.length,
        );
      } else {
        console.log('Треки не найдены в подборке');
      }

      console.log('Треки из подборки:', selectionTracks);

      setTracks(selectionTracks);
      dispatch(setAllTracks(selectionTracks));

      // Обновляем название на реальное из API
      if (data.name && data.name !== 'Подборка') {
        setSelectionName(data.name);
        console.log('Название подборки обновлено:', data.name);
      } else {
        console.log('Используется название из alt:', altName);
      }

      // Проверяем, есть ли треки
      if (selectionTracks.length === 0) {
        console.log('Подборка пустая - нет треков');
      }
    } catch (err: any) {
      console.error('Ошибка загрузки подборки:', err);
      setError('Не удалось загрузить подборку');

      // Оставляем название из alt (query параметра)
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
            <div className={styles.loadingContainer}>
              <h2 className={styles.loadingTitle}>Загрузка {altName}...</h2>
            </div>
            <MainSidebar />
          </main>
          <Bar />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <main className={styles.main}>
            <MainNav />
            <div className={styles.errorContainer}>
              <h2 className={styles.errorTitle}>{error}</h2>
              <p>Подборка: {selectionName}</p>
              <button
                className={styles.retryButton}
                onClick={() => loadSelection()}
              >
                Попробовать снова
              </button>
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
