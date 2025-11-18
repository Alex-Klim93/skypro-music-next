import Image from 'next/image';
import Link from 'next/link';
import classnames from 'classnames';

import './page.css';
import styles from './page.module.css';
import Bar from './components/Bar/Bar';
import MainNav from './components/MainNav/MainNav';
import MainSidebar from './components/MainSidebar/MainSidebar';
import Centerblock from './components/Centerblock/Centerblock';

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
        <MainNav/>
        <Centerblock/>
        <MainSidebar />
        </main>
        <Bar />
        <footer className={styles.footer}></footer>
      </div>
    </div>
  );
}
