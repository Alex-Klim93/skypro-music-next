// SidebarBlock.tsx
'use client';

import styles from './SidebarBlock.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function SidebarBlock() {
  return (
    <div className={styles.sidebar__block}>
      <div className={styles.sidebar__list}>
        <div className={styles.sidebar__item}>
          <Link
            className={styles.sidebar__link}
            href="/selection/2?name=Плейлист дня" // ID=2
          >
            <Image
              className={styles.sidebar__img}
              src="/img/playlist01.png"
              alt="Плейлист дня"
              width={250}
              height={170}
            />
          </Link>
        </div>
        <div className={styles.sidebar__item}>
          <Link
            className={styles.sidebar__link}
            href="/selection/3?name=Танцевальные хиты" // ID=3
          >
            <Image
              className={styles.sidebar__img}
              src="/img/playlist02.png"
              alt="Танцевальные хиты"
              width={250}
              height={170}
            />
          </Link>
        </div>
        <div className={styles.sidebar__item}>
          <Link
            className={styles.sidebar__link}
            href="/selection/4?name=Инди-заряд" // ID=4
          >
            <Image
              className={styles.sidebar__img}
              src="/img/playlist03.png"
              alt="Инди-заряд"
              width={250}
              height={170}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
