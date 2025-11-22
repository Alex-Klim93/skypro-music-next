import styles from './SidebarBlock.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function SidebarBlock() {
  return (
    <div className={styles.sidebar__block}>
      <div className={styles.sidebar__list}>
        <div className={styles.sidebar__item}>
          <Link className={styles.sidebar__link} href="#">
            <Image
              className={styles.sidebar__img}
              src="/img/playlist01.png"
              alt="day's playlist"
              width={250}
              height={170}
            />
          </Link>
        </div>
        <div className={styles.sidebar__item}>
          <Link className={styles.sidebar__link} href="#">
            <Image
              className={styles.sidebar__img}
              src="/img/playlist02.png"
              alt="day's playlist"
              width={250}
              height={170}
            />
          </Link>
        </div>
        <div className={styles.sidebar__item}>
          <Link className={styles.sidebar__link} href="#">
            <Image
              className={styles.sidebar__img}
              src="/img/playlist03.png"
              alt="day's playlist"
              width={250}
              height={170}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
