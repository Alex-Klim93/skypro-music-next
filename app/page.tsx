'use client';

import styles from './page.module.css';
import Bar from './components/Bar/Bar';
import MainNav from './components/MainNav/MainNav';
import MainSidebar from './components/MainSidebar/MainSidebar';
import Centerblock from './components/Centerblock/Centerblock';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { getTracks, getFavoriteTracks } from '@/app/services/traks/trackApi';
import { useAppDispatch, useAppSelector } from './store/store';
import { setAllTracks, setFavoriteTracks } from './store/features/trackSlice';
import { setUser, setAccessToken, logout } from '@/app/services/auth/authSlice';
import { useRouter, usePathname } from 'next/navigation';

export default function Home() {
  const dispatch = useAppDispatch();
  const allTracks = useAppSelector((state) => state.tracks.allTracks);
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // Загружаем все треки (для всех пользователей)
  const loadAllTracks = useCallback(async () => {
    try {
      if (allTracks.length === 0) {
        // Загружаем все треки без авторизации
        const tracksData = await getTracks();
        dispatch(setAllTracks(tracksData));
      }
    } catch (error) {
      console.error('Ошибка загрузки треков:', error);
    }
  }, [dispatch, allTracks.length]);

  // Проверяем авторизацию и загружаем избранное только если пользователь авторизован
  const checkAuthAndLoadData = useCallback(async () => {
    try {
      // Проверяем наличие пользователя в localStorage
      const storedUser = localStorage.getItem('user');
      const storedAccessToken = localStorage.getItem('access_token');

      // Загружаем все треки (для всех пользователей)
      await loadAllTracks();

      // Если пользователь авторизован, загружаем его избранные треки
      if (storedUser && storedAccessToken) {
        // Устанавливаем пользователя и токен в Redux если их еще нет
        if (!user) {
          dispatch(setUser(JSON.parse(storedUser)));
          dispatch(setAccessToken(storedAccessToken));
        }

        // Загружаем избранные треки
        try {
          const favoriteTracksData = await getFavoriteTracks(storedAccessToken);
          dispatch(setFavoriteTracks(favoriteTracksData));
        } catch (error) {
          console.error('Ошибка загрузки избранных треков:', error);
          // При ошибке 401 очищаем сессию
          if (error instanceof Error && error.message.includes('401')) {
            dispatch(logout());
            // Продолжаем работу как неавторизованный пользователь
          }
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, user, router, pathname, loadAllTracks]);

  useEffect(() => {
    checkAuthAndLoadData();
  }, [checkAuthAndLoadData]);

  // Оптимизация с useMemo для предотвращения лишних рендеров
  const loadingContent = useMemo(
    () => (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <main className={styles.main}>
            <MainNav />
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: 'white',
                flex: 1,
              }}
            >
              <h2>Загрузка...</h2>
            </div>
            <MainSidebar />
          </main>
          <Bar />
        </div>
      </div>
    ),
    [],
  );

  const mainContent = useMemo(
    () => (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <main className={styles.main}>
            <MainNav />
            <Centerblock tracks={allTracks} title="Треки" />
            <MainSidebar />
          </main>
          <Bar />
        </div>
      </div>
    ),
    [allTracks],
  );

  if (loading) {
    return loadingContent;
  }

  return mainContent;
}