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

  // Оптимизация с useCallback для предотвращения пересоздания функции
  const checkAuthAndLoadData = useCallback(async () => {
    try {
      // Проверяем наличие пользователя в localStorage
      const storedUser = localStorage.getItem('user');
      const storedAccessToken = localStorage.getItem('access_token');
      const storedRefreshToken = localStorage.getItem('refresh_token');

      // Если пользователь на странице избранного и нет токенов, редиректим на главную
      if (
        pathname?.includes('favorites') &&
        (!storedUser || !storedAccessToken)
      ) {
        console.log(
          'Пользователь не авторизован на странице избранного, редирект на главную',
        );
        router.push('/');
        return;
      }

      if (!storedUser || !storedAccessToken) {
        console.log('Пользователь не авторизован, редирект на Signin');
        router.push('/Signin');
        return;
      }

      // Устанавливаем пользователя и токен в Redux если их еще нет
      if (!user) {
        dispatch(setUser(JSON.parse(storedUser)));
        dispatch(setAccessToken(storedAccessToken));
      }

      // Загружаем данные только если их нет в Redux
      if (allTracks.length === 0) {
        await loadAllData(storedAccessToken);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      // При ошибке аутентификации очищаем сессию
      if (error instanceof Error && error.message.includes('401')) {
        dispatch(logout());
        router.push('/Signin');
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, user, allTracks.length, router, pathname]);

  // Оптимизация с useCallback
  const loadAllData = useCallback(
    async (accessToken: string) => {
      try {
        // Загружаем все треки
        const tracksData = await getTracks(accessToken);
        dispatch(setAllTracks(tracksData));

        // Загружаем избранные треки
        const favoriteTracksData = await getFavoriteTracks(accessToken);
        dispatch(setFavoriteTracks(favoriteTracksData));
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    },
    [dispatch],
  );

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
