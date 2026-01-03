'use client';

import { useState } from 'react';
import styles from './DeleteSelectionPopup.module.css';

interface DeleteSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  selectionName: string;
}

export default function DeleteSelectionPopup({
  isOpen,
  onClose,
  onDelete,
  selectionName,
}: DeleteSelectionPopupProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await onDelete();
    } catch (err) {
      setError('Ошибка удаления подборки');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={handleClose}>
          ✕
        </button>

        <div className={styles.warningIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9V12M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z"
              stroke="#e74c3c"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className={styles.title}>Удалить подборку</h2>

        <p className={styles.message}>
          Вы уверены, что хотите удалить подборку
          <span className={styles.selectionName}> {selectionName}</span>?
        </p>

        <p className={styles.warning}>
          Это действие нельзя отменить. Все треки в подборке будут удалены.
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.deleteButton}
              disabled={loading}
            >
              {loading ? 'Удаление...' : 'Удалить подборку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
