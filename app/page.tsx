'use client';

import styles from './page.module.css';
import Bar from './components/Bar/Bar';
import MainNav from './components/MainNav/MainNav';
import MainSidebar from './components/MainSidebar/MainSidebar';
import Centerblock from './components/Centerblock/Centerblock';
import { useEffect, useState } from 'react';
import { getTracks } from './services/traks/trackApi';
import { TrackType } from './sharedTypes/sharedTypes';
import { error } from 'console';
import { AxiosError } from 'axios';

export default function Home() {
  const [Tracks, setTracks] = useState<TrackType[]>([]);

  useEffect(() => {
    getTracks()
      .then((res) => {
        setTracks(res);
        alert('res');
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            // Запрос был сделан, и сервер ответил кодом состояния, который
            // выходит за пределы 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // Запрос был сделан, но ответ не получен
            // `error.request`- это экземпляр XMLHttpRequest в браузере и экземпляр
            // http.ClientRequest в node.js
            console.log(error.request);
          } else {
            // Произошло что-то при настройке запроса, вызвавшее ошибку
            console.log('Error', error.message);
          }
        }
      });
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <MainNav />
          <Centerblock />
          <MainSidebar />
        </main>
        <Bar />
        <footer className={styles.footer}></footer>
      </div>
    </div>
  );
}
function getTrecks() {
  throw new Error('Function not implemented.');
}
