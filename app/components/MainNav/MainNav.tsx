import styles from './MainNav.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function MainNav() {
  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}>
        <Link href="/">
          <Image
            width={113}
            height={17}
            className={styles.logo__image}
            src="/img/logo.png"
            alt="logo"
          />
        </Link>
      </div>
      <div className={styles.nav__burger}>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </div>
      <div className={styles.nav__menu}>
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link href="/" className={styles.menu__link}>
              Главное
            </Link>
          </li>
          <li className={styles.menu__item}>
            <Link href="/ffff" className={styles.menu__link}>
              Мой плейлист
            </Link>
          </li>
          <li className={styles.menu__item}>
            <Link href="/Signin" className={styles.menu__link}>
              Войти
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
