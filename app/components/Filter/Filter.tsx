import styles from './Filter.module.css';

interface FilterProps {
  items: string[];
  isOpen: boolean;
  onClose: () => void;
  filterType: string | null;
}

export default function Filter({
  items,
  isOpen,
  onClose,
  filterType,
}: FilterProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.filterPopup} onClick={onClose}>
      <div
        className={styles.filterContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.filterList}>
          {items.map((item, index) => (
            <div key={index} className={styles.filterItem}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
