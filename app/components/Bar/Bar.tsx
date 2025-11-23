'use client';

import styles from './bar.module.css';
import Link from 'next/link';
import classnames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { useRef, useEffect } from 'react';
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Функция для переключения воспроизведения и паузы
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (audio) {
      try {
        if (isPlay) {
          audio.pause();
        } else {
          await audio.play();
        }
        dispatch(setIsPlay(!isPlay));
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  // Обработчик изменения времени
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      dispatch(setCurrentTime(audio.currentTime));
    }
  };

  // Обработчик загрузки метаданных
  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      dispatch(setDuration(audio.duration));
      if (isPlay) {
        audio.play().catch(console.error);
      }
    }
  };

  // Обработчик окончания трека
  const handleEnded = () => {
    if (isLoop) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
    } else {
      dispatch(nextTrack());
    }
  };

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

    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume;
    }
  };

  // Переключение повтора
  const toggleLoop = () => {
    dispatch(setIsLoop(!isLoop));
  };

  // Переключение перемешивания
  const toggleShuffle = () => {
    dispatch(setIsShuffle(!isShuffle));
  };

  // Синхронизация аудио элемента с состоянием
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.loop = isLoop;
    }
  }, [volume, isLoop]);

  // Автоматическое воспроизведение при смене трека
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentTrack) {
      audio.currentTime = 0;
      dispatch(setCurrentTime(0));

      if (isPlay) {
        setTimeout(() => {
          audio.play().catch(console.error);
        }, 100);
      }
    }
  }, [currentTrack, dispatch, isPlay]);

  // Рассчет прогресса в процентах
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) return null;

  return (
    <div className={styles.bar}>
      <audio
        ref={audioRef}
        src={currentTrack.track_file}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={(e) => console.error('Audio error:', e)}
      />
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
