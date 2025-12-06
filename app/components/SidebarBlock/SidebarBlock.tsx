'use client';

import styles from './SidebarBlock.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  getAllSelections,
  SelectionType,
  createSelection,
} from '@/app/services/selections/selectionApi';
import CreateSelectionPopup from '@/app/components/CreateSelectionPopup/CreateSelectionPopup';

export default function SidebarBlock() {
  const [selections, setSelections] = useState<SelectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePopup, setShowCreatePopup] = useState(false);

  const loadSelections = async () => {
    try {
      console.log('Запрашиваем подборки...');
      const data = await getAllSelections();
      console.log('Получены подборки:', data);
      setSelections(data);

      if (data.length > 0) {
        console.log(`Найдено ${data.length} подборок:`);
        data.forEach((selection) => {
          console.log(
            `- ID: ${selection._id}, Name: ${selection.name}, Logo: ${selection.logo}`,
          );
        });
      } else {
        console.log('Подборок нет');
      }
    } catch (err) {
      console.error('Ошибка загрузки подборок:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSelections();
  }, []);

  const handleCreateSelection = async (name: string, logoFile: File | null) => {
    try {
      console.log(
        'Создание подборки:',
        name,
        'с картинкой:',
        logoFile?.name || 'нет',
      );
      const newSelection = await createSelection(name, logoFile);
      console.log('Создана подборка:', newSelection);

      await loadSelections();
      return newSelection;
    } catch (err) {
      console.error('Ошибка создания подборки:', err);
      throw err;
    }
  };

  const handleOpenCreatePopup = () => {
    setShowCreatePopup(true);
  };

  const handleCloseCreatePopup = () => {
    setShowCreatePopup(false);
  };

  if (loading) {
    return (
      <div className={styles.sidebar__block}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (selections.length === 0) {
    return (
      <>
        <div className={styles.sidebar__block}>
          <div className={styles.sidebar__list}>
            <div className={styles.sidebar__item}>
              <button
                className={styles.createButton}
                onClick={handleOpenCreatePopup}
              >
                <div className={styles.createButtonContent}>
                  <span className={styles.plusIcon}>+</span>
                  <span className={styles.createText}>Создать подборку</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <CreateSelectionPopup
          isOpen={showCreatePopup}
          onClose={handleCloseCreatePopup}
          onCreate={handleCreateSelection}
        />
      </>
    );
  }

  return (
    <>
      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          {selections.map((selection, index) => (
            <div key={selection._id} className={styles.sidebar__item}>
              <Link
                className={styles.sidebar__link}
                href={`/selection/${selection._id}?name=${encodeURIComponent(selection.name)}`}
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

      <CreateSelectionPopup
        isOpen={showCreatePopup}
        onClose={handleCloseCreatePopup}
        onCreate={handleCreateSelection}
      />
    </>
  );
}
