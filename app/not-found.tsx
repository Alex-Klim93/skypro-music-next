import Link from 'next/link';
import styles from './not-found.module.css';
import Bar from './components/Bar/Bar';
import MainNav from './components/MainNav/MainNav';
import MainSidebar from './components/MainSidebar/MainSidebar';
import Search from './components/Search/Search';

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <MainNav />

          <div className={styles.centerblock}>
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
          </div>

          <div className={styles.main__sidebar}>
            <div className={styles.sidebar__personal}>
              <p className={styles.sidebar__personalName}>Sergey.Ivanov</p>
              <div className={styles.sidebar__icon}>
                <svg>
                  <use xlinkHref="/img/icon/sprite.svg#logout"></use>
                </svg>
              </div>
            </div>
          </div>
        </main>
        <Bar />
        <footer className={styles.footer}></footer>
      </div>
    </div>
  );
}
