'use client';

import styles from './Centerblock.module.css';
import classNames from 'classnames';
import Search from '../Search/Search';
import {
  getUniqueValuesByKey,
  getUniqueGenreValues,
  getUniqueYears,
} from '@/app/utils/helper';
import { useState } from 'react';
import Filter from '../Filter/Filter';
import Track from '../Track/Track';
import { TrackType } from '@/app/sharedTypes/sharedTypes';
import { SelectionType } from '@/app/services/selections/selectionApi';
import Link from 'next/link';
import Image from 'next/image';

interface CenterblockProps {
  tracks: TrackType[];
  title?: string;
  selections?: SelectionType[]; // Добавляем пропс для подборок
}

export default function Centerblock({
  tracks,
  title = 'Треки',
  selections = [], // По умолчанию пустой массив
}: CenterblockProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const uniqueAuthors = getUniqueValuesByKey(tracks, 'author');
  const uniqueGenres = getUniqueGenreValues(tracks);
  const uniqueYears = getUniqueYears(tracks);

  const handleFilterClick = (filterName: string) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  const handleCloseFilter = () => {
    setActiveFilter(null);
  };

  const getFilterItems = () => {
    switch (activeFilter) {
      case 'author':
        return uniqueAuthors;
      case 'genre':
        return uniqueGenres;
      case 'year':
        return uniqueYears;
      default:
        return [];
    }
  };

  // Если это страница с подборками
  const isSelectionsPage = selections.length > 0;

  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>{title}</h2>

      {!isSelectionsPage && (
        <div className={styles.centerblock__filter}>
          <div className={styles.filter__title}>Искать по:</div>

          <button
            className={classNames(styles.filter__button, {
              [styles.active]: activeFilter === 'author',
            })}
            onClick={() => handleFilterClick('author')}
          >
            исполнителю
          </button>

          <button
            className={classNames(styles.filter__button, {
              [styles.active]: activeFilter === 'year',
            })}
            onClick={() => handleFilterClick('year')}
          >
            году выпуска
          </button>

          <button
            className={classNames(styles.filter__button, {
              [styles.active]: activeFilter === 'genre',
            })}
            onClick={() => handleFilterClick('genre')}
          >
            жанру
          </button>

          <Filter
            items={getFilterItems()}
            isOpen={activeFilter !== null}
            onClose={handleCloseFilter}
            filterType={activeFilter}
          />
        </div>
      )}

      <div className={styles.centerblock__content}>
        {!isSelectionsPage ? (
          // Отображение треков
          <>
            <div className={styles.content__title}>
              <div
                className={classNames(styles.playlistTitle__col, styles.col01)}
              >
                Трек
              </div>
              <div
                className={classNames(styles.playlistTitle__col, styles.col02)}
              >
                Исполнитель
              </div>
              <div
                className={classNames(styles.playlistTitle__col, styles.col03)}
              >
                Альбом
              </div>
              <div
                className={classNames(styles.playlistTitle__col, styles.col04)}
              >
                <svg className={styles.playlistTitle__svg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
                </svg>
              </div>
            </div>
            <div className={styles.content__playlist}>
              {tracks.map((track, index) => (
                <Track
                  key={track._id}
                  track={track}
                  playlist={tracks}
                  index={index}
                />
              ))}
            </div>
          </>
        ) : (
          // Отображение подборок
          <div className={styles.selections__grid}>
            {selections.map((selection, index) => (
              <Link
                key={selection.id}
                href={`/selection/${selection.id}`}
                className={styles.selection__card}
              >
                <div className={styles.selection__image}>
                  <Image
                    src={selection.logo || `/img/playlist0${index + 1}.png`}
                    alt={selection.name || `Подборка ${index + 1}`}
                    width={250}
                    height={170}
                    className={styles.selection__img}
                  />
                </div>
                <div className={styles.selection__info}>
                  <h3 className={styles.selection__name}>{selection.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
