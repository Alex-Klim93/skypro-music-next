'use client';

import { useState } from 'react';
import styles from './CreateSelectionPopup.module.css';
import Image from 'next/image';

interface CreateSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, logo: File | null) => Promise<void>;
}

export default function CreateSelectionPopup({
  isOpen,
  onClose,
  onCreate,
}: CreateSelectionPopupProps) {
  const [name, setName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);

      // Создаем превью для изображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Введите название подборки');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onCreate(name, logoFile);
      resetForm();
      onClose();
    } catch (err) {
      setError('Ошибка создания подборки');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setLogoFile(null);
    setLogoPreview(null);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={handleClose}>
          ✕
        </button>

        <h2 className={styles.title}>Создать подборку</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Поле для названия */}
          <div className={styles.inputGroup}>
            <label htmlFor="selectionName" className={styles.label}>
              Название подборки *
            </label>
            <input
              id="selectionName"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className={styles.input}
              placeholder="Введите название..."
              disabled={loading}
              required
              autoFocus
            />
          </div>

          {/* Поле для загрузки картинки */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Картинка подборки (опционально)
            </label>

            <div className={styles.logoUploadContainer}>
              {logoPreview ? (
                <div className={styles.logoPreviewContainer}>
                  <Image
                    src={logoPreview}
                    alt="Превью картинки подборки"
                    width={150}
                    height={100}
                    className={styles.logoPreview}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className={styles.removeLogoButton}
                    disabled={loading}
                  >
                    Удалить
                  </button>
                </div>
              ) : (
                <label className={styles.logoUploadArea}>
                  <div className={styles.uploadContent}>
                    <svg
                      className={styles.uploadIcon}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 5V19M5 12H19"
                        stroke="#666"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className={styles.uploadText}>
                      Нажмите для загрузки картинки
                    </span>
                    <span className={styles.uploadHint}>
                      Рекомендуемый размер: 250×170px
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className={styles.logoInput}
                    disabled={loading}
                  />
                </label>
              )}
            </div>
            <p className={styles.logoHint}>
              Поддерживаются форматы: JPG, PNG, GIF. Максимальный размер: 5MB
            </p>
          </div>

          {error && <p className={styles.error}>{error}</p>}

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
              className={styles.createButton}
              disabled={loading || !name.trim()}
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
