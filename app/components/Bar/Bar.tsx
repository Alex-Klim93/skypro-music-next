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
} from '@/app/store/features/trackSlice';
import { formatTime } from '@/app/utils/helper';

export default function Bar() {
  const {
    currentTrack,
    isPlay,
    currentTime,
    duration,
    volume,
    isLoop,
    isShuffle,
  } = useAppSelector((state) => state.tracks);
  const dispatch = useAppDispatch();

  // Управление audio элементом через useRef
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Обработка событий audio элемента через useEffect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Обработчики событий audio элемента
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

    // Подписываемся на события
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    // Отписываемся при размонтировании
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [dispatch, isPlay, isLoop]);

  // Управление воспроизведением/паузой через useEffect
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

  // Управление громкостью через useEffect
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  // Управление зацикливанием через useEffect
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = isLoop;
    }
  }, [isLoop]);

  // Обработчик клика по прогресс-бару
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

  // Обработчик изменения громкости
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    dispatch(setVolume(newVolume));
  };

  // Переключение воспроизведения
  const togglePlay = () => {
    dispatch(setIsPlay(!isPlay));
  };

  // Переключение повтора
  const toggleLoop = () => {
    dispatch(setIsLoop(!isLoop));
  };

  // Переключение перемешивания
  const toggleShuffle = () => {
    dispatch(setIsShuffle(!isShuffle));
  };

  // Рассчет прогресса в процентах
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) return null;

  return (
    <div className={styles.bar}>
      {/* Управление audio элементом через ref */}
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
                  className={classnames(styles.trackPlay__like, styles.btnIcon)}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div
                  className={classnames(
                    styles.trackPlay__dislike,
                    styles.btnIcon,
                  )}
                >
                  <svg className={styles.trackPlay__dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
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
