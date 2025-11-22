'use client';

import styles from './Centerblock.module.css';
import { data } from '@/app/data';
import classNames from 'classnames';
import Search from '../Search/Search';
import Playlist from '../Playlist/Playlist';
import { getUniqueValuesByKey } from '@/app/utils/helper';
import { useState } from 'react';
import Filter from '../Filter/Filter';

export default function Centerblock() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Получаем уникальные значения из данных
  const uniqueAuthors = getUniqueValuesByKey(data, 'author');
  const uniqueGenres = getUniqueValuesByKey(data, 'genre');
  const uniqueYears = getUniqueValuesByKey(data, 'release_date');

  const handleFilterClick = (filterName: string) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  const handleCloseFilter = () => {
    setActiveFilter(null);
  };

  // Получаем данные для активного фильтра
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

  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>Треки</h2>

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

      <div className={styles.centerblock__content}>
        <div className={styles.content__title}>
          <div className={classNames(styles.playlistTitle__col, styles.col01)}>
            Трек
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col02)}>
            Исполнитель
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col03)}>
            Альбом
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col04)}>
            <svg className={styles.playlistTitle__svg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
            </svg>
          </div>
        </div>

        <Playlist />
      </div>
    </div>
  );
}
