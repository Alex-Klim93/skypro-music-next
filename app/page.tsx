'use client';

import styles from './page.module.css';
import Bar from './components/Bar/Bar';
import MainNav from './components/MainNav/MainNav';
import MainSidebar from './components/MainSidebar/MainSidebar';
import Centerblock from './components/Centerblock/Centerblock';
import { useEffect } from 'react';
import { getTracks } from '@/app/services/traks/trackApi';
import { useAppDispatch, useAppSelector } from './store/store';
import { setAllTracks } from './store/features/trackSlice';
import { useRouter } from 'next/navigation';

export default function Home() {
  const dispatch = useAppDispatch();
  const allTracks = useAppSelector((state) => state.tracks.allTracks);
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
      loadTracks();
    }
  }, [router, dispatch]);

  const loadTracks = async () => {
    try {
      const tracksData = await getTracks();
      dispatch(setAllTracks(tracksData));
    } catch (error) {
      console.error('Ошибка загрузки треков:', error);
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
