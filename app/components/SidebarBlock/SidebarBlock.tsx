'use client';

import styles from './SidebarBlock.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  getAllSelections,
  SelectionType,
} from '@/app/services/selections/selectionApi';

export default function SidebarBlock() {
  const [selections, setSelections] = useState<SelectionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSelections();
  }, []);

  const loadSelections = async () => {
    try {
      const data = await getAllSelections();
      setSelections(data);
    } catch (err) {
      console.error('Ошибка загрузки подборок:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.sidebar__block}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.sidebar__block}>
      <div className={styles.sidebar__list}>
        {selections.map((selection, index) => (
          <div key={selection._id} className={styles.sidebar__item}>
            <Link
              className={styles.sidebar__link}
              href={`/selection/${selection.id}`}
            >
              <Image
                className={styles.sidebar__img}
                src={selection.logo || `/img/playlist0${index + 1}.png`}
                alt={selection.name || `Подборка ${index + 1}`}
                width={250}
                height={170}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
