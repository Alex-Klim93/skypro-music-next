'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSelectionById } from '@/app/services/selections/selectionApi';
import { TrackType } from '@/app/sharedTypes/sharedTypes';
import Bar from '@/app/components/Bar/Bar';
import MainNav from '@/app/components/MainNav/MainNav';
import MainSidebar from '@/app/components/MainSidebar/MainSidebar';
import Centerblock from '@/app/components/Centerblock/Centerblock';
import styles from '@/app/page.module.css';
import { useAppDispatch } from '@/app/store/store';
import { setAllTracks } from '@/app/store/features/trackSlice';

export default function SelectionPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const id = Number(params.id);

  const [tracks, setTracks] = useState<TrackType[]>([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/Signin');
      return;
    }

  }, [router, id]);

  const loadSelection = async () => {
    try {
      const data = await getSelectionById(id);

      const selectionTracks = data.items || data.tracks || [];
      setTracks(selectionTracks);
      dispatch(setAllTracks(selectionTracks));
    } catch (err) {
      console.error('Ошибка загрузки подборки:', err);
    }
  };


  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <MainNav />
          <Centerblock tracks={tracks} title={'Подборка'} />
          <MainSidebar />
        </main>
        <Bar />
      </div>
    </div>
  );
}
