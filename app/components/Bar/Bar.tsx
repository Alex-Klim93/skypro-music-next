'use client';

import styles from './bar.module.css';
import Link from 'next/link';
import classnames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { useRef, useEffect, useState } from 'react';
import {
  setIsPlay,
  setCurrentTime,
  setDuration,
  setVolume,
  setIsLoop,
  setIsShuffle,
  nextTrack,
  prevTrack,
  addToFavoritesState,
  removeFromFavoritesState,
} from '@/app/store/features/trackSlice';
import { formatTime } from '@/app/utils/helper';
import {
  addToFavorites,
  removeFromFavorites,
} from '@/app/services/traks/trackApi';

// Интерфейсы для типизации ошибок
interface ErrorResponse {
  status: number;
  data?: any;
}

interface ApiError extends Error {
  response?: ErrorResponse;
  request?: any;
  config?: any;
}

export default function Bar() {
  const {
    currentTrack,
    isPlay,
    currentTime,
    duration,
    volume,
    isLoop,
    isShuffle,
    favoriteTrackIds,
  } = useAppSelector((state) => state.tracks);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const isFavorite = currentTrack
    ? favoriteTrackIds.includes(currentTrack._id)
    : false;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      dispatch(setCurrentTime(audio.currentTime));
    };

    const handleLoadedMetadata = () => {
      dispatch(setDuration(audio.duration));
    };

    const handleEnded = () => {
      if (isLoop) {
        audio.currentTime = 0;
        audio.play();
      } else {
        dispatch(nextTrack());
      }
    };

    const handleCanPlay = () => {
      if (isPlay) {
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
          dispatch(setIsPlay(false));
        });
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [dispatch, isPlay, isLoop]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const playAudio = async () => {
      try {
        await audio.play();
        dispatch(setIsPlay(true));
      } catch (error) {
        console.error('Error playing audio:', error);
        dispatch(setIsPlay(false));
      }
    };

    if (isPlay) {
      playAudio();
    } else {
      audio.pause();
    }
  }, [isPlay, currentTrack, dispatch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = isLoop;
    }
  }, [isLoop]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    const audio = audioRef.current;

    if (progressBar && audio && duration > 0) {
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audio.currentTime = newTime;
      dispatch(setCurrentTime(newTime));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    dispatch(setVolume(newVolume));
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!currentTrack) return;

    if (!user) {
      alert('Чтобы добавить трек в избранное, пожалуйста, авторизуйтесь.');
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(currentTrack._id);
        dispatch(removeFromFavoritesState(currentTrack._id));
      } else {
        await addToFavorites(currentTrack._id);
        dispatch(addToFavoritesState(currentTrack));
      }
    } catch (error: unknown) {
      console.error('Ошибка обновления избранного:', error);

      // Преобразуем ошибку к типу ApiError
      const apiError = error as ApiError;

      if (apiError.response?.status === 401) {
        alert('Ваша сессия истекла. Пожалуйста, авторизуйтесь снова.');
      } else if (apiError.response?.status === 400) {
        alert('Некорректный запрос. Пожалуйста, попробуйте позже.');
      } else if (apiError.response?.status === 500) {
        alert('Серверная ошибка. Пожалуйста, попробуйте позже.');
      } else {
        alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
      }
    }
  };

  const togglePlay = () => {
    dispatch(setIsPlay(!isPlay));
  };

  const toggleLoop = () => {
    dispatch(setIsLoop(!isLoop));
  };

  const toggleShuffle = () => {
    dispatch(setIsShuffle(!isShuffle));
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) return null;

  return (
    <div className={styles.bar}>
      <audio ref={audioRef} src={currentTrack.track_file} preload="metadata" />

      <div className={styles.bar__content}>
        <div
          ref={progressBarRef}
          className={styles.bar__playerProgress}
          onClick={handleProgressClick}
        >
          <div
            className={styles.progress__filled}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div
                className={classnames(styles.player__btnPrev, styles.btn)}
                onClick={() => dispatch(prevTrack())}
              >
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>

              <div
                className={classnames(styles.player__btnPlay, styles.btn)}
                onClick={togglePlay}
              >
                <svg className={styles.player__btnPlaySvg}>
                  <use
                    xlinkHref={
                      isPlay
                        ? '/img/icon/sprite.svg#icon-pause'
                        : '/img/icon/sprite.svg#icon-play'
                    }
                  ></use>
                </svg>
              </div>

              <div
                className={classnames(styles.player__btnNext, styles.btn)}
                onClick={() => dispatch(nextTrack())}
              >
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>

              <div
                className={classnames(
                  styles.player__btnRepeat,
                  styles.btnIcon,
                  { [styles.active]: isLoop },
                )}
                onClick={toggleLoop}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>

              <div
                className={classnames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                  { [styles.active]: isShuffle },
                )}
                onClick={toggleShuffle}
              >
                <svg className={styles.player__btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <svg className={styles.trackPlay__svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div className={styles.trackPlay__author}>
                  <Link className={styles.trackPlay__authorLink} href="">
                    {currentTrack.name}
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="">
                    {currentTrack.author}
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlay__time}>
                <span className={styles.trackPlay__currentTime}>
                  {formatTime(currentTime)}
                </span>
                <span className={styles.trackPlay__separator}> / </span>
                <span className={styles.trackPlay__duration}>
                  {formatTime(duration)}
                </span>
              </div>

              <div className={styles.trackPlay__likeDislike}>
                <div
                  className={classnames(
                    styles.trackPlay__like,
                    styles.btnIcon,
                    {
                      [styles.favoriteActive]: isFavorite,
                      [styles.active]: isFavorite,
                    },
                  )}
                  onClick={handleFavoriteClick}
                  title={
                    isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'
                  }
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={classnames(styles.volume__progress, styles.btn)}>
                <input
                  className={classnames(
                    styles.volume__progressLine,
                    styles.btn,
                  )}
                  type="range"
                  name="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
