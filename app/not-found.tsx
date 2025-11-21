import Image from 'next/image';
import Link from 'next/link';
import styles from './not-found.module.css';
import Bar from './components/Bar/Bar';
import MainNav from './components/MainNav/MainNav';
import Search from './components/Search/Search';

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <MainNav />
        </main>
        <Search />

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
        <footer className={styles.footer}></footer>
      </div>
    </div>
  );
}
