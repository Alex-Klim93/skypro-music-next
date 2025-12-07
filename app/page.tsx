'use client';

import styles from './page.module.css';
import Bar from './components/Bar/Bar';
import MainNav from './components/MainNav/MainNav';
import MainSidebar from './components/MainSidebar/MainSidebar';
import Centerblock from './components/Centerblock/Centerblock';
import { useEffect } from 'react';
import { getTracks, getFavoriteTracks } from '@/app/services/traks/trackApi';
import { useAppDispatch, useAppSelector } from './store/store';
import { setAllTracks, setFavoriteTracks } from './store/features/trackSlice';
import { useRouter } from 'next/navigation';

export default function Home() {
  const dispatch = useAppDispatch();
  const allTracks = useAppSelector((state) => state.tracks.allTracks);
  const favoriteTracks = useAppSelector((state) => state.tracks.favoriteTracks);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      if (!user) {
        router.push('/Signin');
        return false;
      }
      return true;
    };

    if (checkAuth()) {
      // Загружаем треки только если их нет в Redux
      if (allTracks.length === 0) {
        console.log('Загружаем все треки...');
        loadAllData();
      } else {
        console.log('Треки уже загружены:', allTracks.length);
      }
    }
  }, [router, dispatch, allTracks.length]);

  const loadAllData = async () => {
    try {
      console.log('Начинаем загрузку всех треков...');
      const tracksData = await getTracks();
      console.log('Треки загружены:', tracksData.length);
      dispatch(setAllTracks(tracksData));

      // Загружаем избранные треки
      if (favoriteTracks.length === 0) {
        console.log('Загружаем избранные треки...');
        const favoriteTracksData = await getFavoriteTracks();
        console.log('Избранные треки загружены:', favoriteTracksData.length);
        dispatch(setFavoriteTracks(favoriteTracksData));
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <MainNav />
          <Centerblock tracks={allTracks} title="Треки" />
          <MainSidebar />
        </main>
        <Bar />
        <footer className={styles.footer}></footer>
      </div>
    </div>
  );
}
