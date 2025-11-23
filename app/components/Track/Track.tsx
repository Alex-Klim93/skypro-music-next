'use client';

import styles from './Track.module.css';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { setCurrentTrack, setIsPlay } from '@/app/store/features/trackSlice';
import { TrackType } from '@/app/sharedTypes/sharedTypes';
import classNames from 'classnames';
import { formatTime } from '@/app/utils/helper';

type trackTypeProp = {
  track: TrackType;
  playlist: TrackType[];
  index: number;
};

export default function Track({ track, playlist, index }: trackTypeProp) {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);

  const isCurrentTrack = currentTrack?._id === track._id;

  const onClickTrack = () => {
    dispatch(setCurrentTrack({ track, playlist, index }));
    dispatch(setIsPlay(true));
  };

  return (
    <div className={styles.playlist__item} onClick={onClickTrack}>
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
            <Link className={styles.track__titleLink} href="">
              {track.name}
              <span className={styles.track__titleSpan}></span>
            </Link>
          </div>
        </div>
        <div className={styles.track__author}>
          <Link className={styles.track__authorLink} href="">
            {track.author}
          </Link>
        </div>
        <div className={styles.track__album}>
          <Link className={styles.track__albumLink} href="">
            {track.album}
          </Link>
        </div>
        <div className={styles.track__time}>
          <svg className={styles.track__timeSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
          </svg>
          <span className={styles.track__timeText}>
            {formatTime(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}