'use client';

import styles from '@/app/page.module.css';
import Bar from '@/app/components/Bar/Bar';
import MainNav from '@/app/components/MainNav/MainNav';
import MainSidebar from '@/app/components/MainSidebar/MainSidebar';
import Centerblock from '@/app/components/Centerblock/Centerblock';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { setFavoriteTracks } from '@/app/store/features/trackSlice';
import { useRouter } from 'next/navigation';
import { getFavoriteTracks } from '@/app/services/traks/trackApi';

export default function MyTracksPage() {
  const dispatch = useAppDispatch();
  const favoriteTracks = useAppSelector((state) => state.tracks.favoriteTracks);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/Signin');
      return;
    }

    loadMyTracks();
  }, [router]);

  const loadMyTracks = async () => {
    try {
      setLoading(true);
      console.log('Загружаем избранные треки...');
      const tracksData = await getFavoriteTracks();
      console.log('Избранные треки загружены:', tracksData.length);
      dispatch(setFavoriteTracks(tracksData));
    } catch (error: any) {
      console.error('Ошибка загрузки плейлиста:', error);

      if (error.response?.status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/Signin');
      }
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
              <h2 style={{ color: 'white' }}>Загрузка плейлиста...</h2>
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
          <Centerblock tracks={favoriteTracks} title="Мой плейлист" />
          <MainSidebar />
        </main>
        <Bar />
      </div>
    </div>
  );
}
