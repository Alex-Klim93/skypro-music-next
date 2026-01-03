'use client';

import styles from '@/app/page.module.css';
import Bar from '@/app/components/Bar/Bar';
import MainNav from '@/app/components/MainNav/MainNav';
import MainSidebar from '@/app/components/MainSidebar/MainSidebar';
import Centerblock from '@/app/components/Centerblock/Centerblock';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { setFavoriteTracks } from '@/app/store/features/trackSlice';
import { setAccessToken, setUser } from '@/app/services/auth/authSlice';
import { useRouter } from 'next/navigation';
import { getFavoriteTracks } from '@/app/services/traks/trackApi';
import { refreshToken } from '@/app/services/traks/trackApi';

export default function MyTracksPage() {
  const dispatch = useAppDispatch();
  const favoriteTracks = useAppSelector((state) => state.tracks.favoriteTracks);
  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const refreshTokenFromStore = useAppSelector(
    (state) => state.auth.refreshToken,
  );
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      // Проверяем наличие токенов
      const storedUser = localStorage.getItem('user');
      const storedAccessToken = localStorage.getItem('access_token');
      const storedRefreshToken = localStorage.getItem('refresh_token');

      if (!storedUser || !storedAccessToken || !storedRefreshToken) {
        console.log('Токены не найдены, редирект на авторизацию');
        router.push('/Signin');
        return;
      }

      // Устанавливаем пользователя и токены в Redux если их еще нет
      if (!user) {
        dispatch(setUser(JSON.parse(storedUser)));
        dispatch(setAccessToken(storedAccessToken));
      }

      setAuthChecked(true);

      // Загружаем избранные треки
      await loadMyTracks();
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error);
      router.push('/Signin');
    } finally {
      setLoading(false);
    }
  };

  const loadMyTracks = async () => {
    try {
      setLoading(true);
      console.log('Загружаем избранные треки...');

      // Получаем актуальный токен
      const currentAccessToken =
        localStorage.getItem('access_token') || accessToken || '';

      const tracksData = await getFavoriteTracks(currentAccessToken);
      console.log('Избранные треки загружены:', tracksData.length);
      dispatch(setFavoriteTracks(tracksData));
    } catch (error: any) {
      console.error('Ошибка загрузки избранных треков:', error);

      // Если ошибка 401, пробуем обновить токен
      if (error.response?.status === 401) {
        try {
          const storedRefreshToken =
            localStorage.getItem('refresh_token') || refreshTokenFromStore;

          if (storedRefreshToken) {
            console.log('Пробуем обновить токен...');
            const newTokens = await refreshToken(storedRefreshToken);

            // Сохраняем новый токен
            localStorage.setItem('access_token', newTokens.access);
            if (newTokens.refresh) {
              localStorage.setItem('refresh_token', newTokens.refresh);
            }

            dispatch(setAccessToken(newTokens.access));

            // Повторяем загрузку с новым токеном
            const tracksData = await getFavoriteTracks(newTokens.access);
            dispatch(setFavoriteTracks(tracksData));
            return;
          }
        } catch (refreshError) {
          console.error('Не удалось обновить токен:', refreshError);
        }
      }

      // Если не удалось восстановить доступ, делаем логаут и редирект
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      router.push('/Signin');
    } finally {
      setLoading(false);
    }
  };

  // Пока проверяем авторизацию или загружаем данные
  if (loading || !authChecked) {
    return (
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
              <h2>Загрузка плейлиста...</h2>
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
