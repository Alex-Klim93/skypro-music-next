import Image from 'next/image';
import Link from 'next/link';
import styles from './not-found.module.css';
import Bar from './components/Bar/Bar';

export default function NotFound() {
  return (
    <nav className={styles.main__nav}>
      <div className={styles.header_box}>
        <div className={styles.nav__logo}>
          <div className={styles.nav__Boxlogo}>
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
        </div>
        <input className={styles.header_sherch} placeholder="Поиск" />
        <div className={styles.header__boxSvg}>
          <svg className={styles.header__btnlogoutSvg}>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </div>
      </div>

      <div className={styles.box__error}>
        <div className={styles.box__errorMin}>
          <h1 className={styles.title__error}>404</h1>
          <div className={styles.subtitle__box}>
            <p className={styles.subtitle__error}>Страница не найдена</p>
            <svg className={styles.subtitle__errorSvg}>
              <use xlinkHref="/img/icon/SmilesCrying.svg"></use>
            </svg>
          </div>
          <p className={styles.text__error}>
            Возможно, она была удалена или перенесена на другой адрес
          </p>
          <div className={styles.errorBox__link}>
            <Link href="/" className={styles.error__link}>
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>

      <Bar />
    </nav>
  );
}
