'use client';

import styles from './Track.module.css';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import {
  setCurrentTrack,
  setIsPlay,
  addToFavoritesState,
  removeFromFavoritesState,
  updateTrackLikes,
} from '@/app/store/features/trackSlice';
import { setAccessToken } from '@/app/services/auth/authSlice';
import { TrackType } from '@/app/sharedTypes/sharedTypes';
import classNames from 'classnames';
import { formatTime } from '@/app/utils/helper';
import {
  addToFavorites,
  removeFromFavorites,
} from '@/app/services/traks/trackApi';
import { useState, useCallback, memo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type trackTypeProp = {
  track: TrackType;
  playlist: TrackType[];
  index: number;
};

function TrackComponent({ track, playlist, index }: trackTypeProp) {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const favoriteTrackIds = useAppSelector(
    (state) => state.tracks.favoriteTrackIds,
  );
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFavorite = favoriteTrackIds.includes(track._id);
  const isCurrentTrack = currentTrack?._id === track._id;

  const onClickTrack = useCallback(() => {
    if (isCurrentTrack) {
      // Если кликаем на текущий трек, переключаем воспроизведение
      dispatch(setIsPlay(!isPlay));
    } else {
      // Если кликаем на другой трек, устанавливаем его как текущий и включаем воспроизведение
      dispatch(setCurrentTrack({ track, playlist, index }));
      dispatch(setIsPlay(true));
    }
  }, [dispatch, track, playlist, index, isCurrentTrack, isPlay]);

  const checkAuth = useCallback(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (!storedAccessToken || !storedUser) {
      alert('Для добавления в избранное необходимо авторизоваться');
      return false;
    }
    return true;
  }, []);

  const handleFavoriteClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      // Проверяем авторизацию
      if (!checkAuth()) {
        // router.push('/');
        return;
      }

      const storedRefreshToken = localStorage.getItem('refresh_token');
      if (!storedRefreshToken) {
        setError('Необходимо авторизоваться');
        setTimeout(() => setError(null), 3000);
        // router.push('/');
        return;
      }

      setLoading(true);
      setError(null);
      setLikeAnimation(true);

      try {
        if (isFavorite) {
          // Удаляем из избранного
          await removeFromFavorites(
            track._id,
            storedRefreshToken,
            dispatch,
            setAccessToken,
          );
          dispatch(removeFromFavoritesState(track._id));
          dispatch(
            updateTrackLikes({
              trackId: track._id,
              likesCount: Math.max((track.likes_count || 0) - 1, 0),
            }),
          );
        } else {
          // Добавляем в избранное
          await addToFavorites(
            track._id,
            storedRefreshToken,
            dispatch,
            setAccessToken,
          );
          dispatch(addToFavoritesState(track));
          dispatch(
            updateTrackLikes({
              trackId: track._id,
              likesCount: (track.likes_count || 0) + 1,
            }),
          );
        }
      } catch (error: any) {
        console.error('Ошибка обновления избранного:', error);
        setError(
          error.response?.data?.message || 'Ошибка при обновлении лайка',
        );

        if (error.response?.status === 401) {
          alert('Сессия истекла. Пожалуйста, войдите снова.');
          router.push('/Siginin');
        }
      } finally {
        setLoading(false);
        setTimeout(() => setLikeAnimation(false), 500);
        setTimeout(() => setError(null), 3000);
      }
    },
    [isFavorite, track, router, checkAuth, dispatch],
  );

  const renderFavoriteButton = () => {
    if (pathname === '/MyTracks') {
      // На странице "Мой плейлист" показываем кнопку удаления
      return (
        <button
          onClick={handleFavoriteClick}
          disabled={loading}
          className={classNames(styles.removeButton, {
            [styles.animate]: likeAnimation,
          })}
          title="Удалить из избранного"
        >
          <svg className={styles.track__timeSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
          </svg>
          <span className={styles.pulseEffect}></span>
        </button>
      );
    }

    // На остальных страницах показываем обычную кнопку лайка
    return (
      <button
        onClick={handleFavoriteClick}
        disabled={loading}
        className={classNames(styles.favoriteButton, {
          [styles.favoriteActive]: isFavorite,
          [styles.animate]: likeAnimation,
          [styles.loading]: loading,
        })}
        title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
      >
        <svg
          className={classNames(styles.track__timeSvg, {
            [styles.favoriteIconActive]: isFavorite,
          })}
        >
          <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
        </svg>
        {/* <span className={styles.pulseEffect}></span> */}
        {/* {track.likes_count > 0 && (
          <span className={styles.likesCount}>{track.likes_count}</span>
        )} */}
      </button>
    );
  };

  return (
    <div className={styles.playlist__item} onClick={onClickTrack}>
      {error && <div className={styles.errorToast}>{error}</div>}
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div
            className={classNames(styles.track__titleImage, {
              [styles.track__titleImageActive]: isCurrentTrack && isPlay,
            })}
          >
            <svg
              className={classNames(styles.track__titleSvg, {
                [styles.active]: isCurrentTrack && isPlay,
              })}
            >
              <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
            </svg>
          </div>
          <div>
            <Link className={styles.track__titleLink} href="#">
              {track.name}
              <span className={styles.track__titleSpan}></span>
            </Link>
          </div>
        </div>
        <div className={styles.track__author}>
          <Link className={styles.track__authorLink} href="#">
            {track.author}
          </Link>
        </div>
        <div className={styles.track__album}>
          <Link className={styles.track__albumLink} href="#">
            {track.album}
          </Link>
        </div>
        <div className={styles.track__time}>{renderFavoriteButton()}</div>
        <span className={styles.track__timeText}>
          {formatTime(track.duration_in_seconds)}
        </span>
      </div>
    </div>
  );
}

export default memo(TrackComponent);
