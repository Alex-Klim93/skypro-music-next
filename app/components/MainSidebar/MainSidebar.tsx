import SidebarBlock from '../SidebarBlock/SidebarBlock';
import styles from './MainSidebar.module.css';

export default function MainSidebar() {
  return (
    <div className={styles.main__sidebar}>
      <div className={styles.sidebar__personal}>
        <p className={styles.sidebar__personalName}>Sergey.Ivanov</p>
        <div className={styles.sidebar__icon}>
          <svg>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </div>
      </div>
      <SidebarBlock />
    </div>
  );
}
