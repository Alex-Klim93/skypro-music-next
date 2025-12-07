'use client';

import { useState, useEffect } from 'react';
import styles from './Search.module.css';

interface SearchProps {
  onSearch: (query: string) => void;
}

export default function Search({ onSearch }: SearchProps) {
  const [searchInput, setSearchInput] = useState('');

  const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, onSearch]);

  return (
    <div className={styles.centerblock__search}>
      <svg className={styles.search__svg}>
        <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
      </svg>
      <input
        className={styles.search__text}
        type="search"
        placeholder="Поиск"
        name="search"
        value={searchInput}
        onChange={onSearchInput}
      />
    </div>
  );
}
