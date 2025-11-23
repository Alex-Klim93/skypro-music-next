import { TrackType } from '@/app/sharedTypes/sharedTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
  currentTrack: null | TrackType;
  isPlay: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoop: boolean;
  isShuffle: boolean;
  currentPlaylist: TrackType[];
  currentTrackIndex: number;
  shuffledPlaylist: TrackType[]; // Для запоминания порядка при перемешивании
  originalPlaylist: TrackType[]; // Оригинальный порядок
};

const initialState: initialStateType = {
  currentTrack: null,
  isPlay: false,
  currentTime: 0,
  duration: 0,
  volume: 0.5,
  isLoop: false,
  isShuffle: false,
  currentPlaylist: [],
  currentTrackIndex: -1,
  shuffledPlaylist: [],
  originalPlaylist: [],
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setCurrentTrack: (
      state,
      action: PayloadAction<{
        track: TrackType;
        playlist?: TrackType[];
        index?: number;
      }>,
    ) => {
      state.currentTrack = action.payload.track;
      if (action.payload.playlist) {
        state.currentPlaylist = action.payload.playlist;
        state.originalPlaylist = action.payload.playlist;

        // Инициализируем shuffledPlaylist если shuffle активен
        if (state.isShuffle) {
          state.shuffledPlaylist = shuffleArray([...action.payload.playlist]);
          // Находим индекс в shuffled плейлисте
          const shuffledIndex = state.shuffledPlaylist.findIndex(
            (track) => track._id === action.payload.track._id,
          );
          state.currentTrackIndex = shuffledIndex;
        } else {
          state.currentTrackIndex = action.payload.index ?? 0;
        }
      } else if (action.payload.index !== undefined) {
        state.currentTrackIndex = action.payload.index;
      }
      state.currentTime = 0;
    },

    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },

    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },

    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },

    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },

    setIsLoop: (state, action: PayloadAction<boolean>) => {
      state.isLoop = action.payload;
    },

    setIsShuffle: (state, action: PayloadAction<boolean>) => {
      const newShuffleState = action.payload;

      if (newShuffleState && !state.isShuffle) {
        // Включаем shuffle - создаем перемешанный плейлист
        if (state.originalPlaylist.length > 0) {
          state.shuffledPlaylist = shuffleArray([...state.originalPlaylist]);

          // Находим текущий трек в перемешанном плейлисте
          const currentTrackId = state.currentTrack?._id;
          if (currentTrackId) {
            const newIndex = state.shuffledPlaylist.findIndex(
              (track) => track._id === currentTrackId,
            );
            if (newIndex !== -1) {
              state.currentTrackIndex = newIndex;
              state.currentPlaylist = state.shuffledPlaylist;
            }
          }
        }
      } else if (!newShuffleState && state.isShuffle) {
        // Выключаем shuffle - возвращаем оригинальный порядок
        const currentTrackId = state.currentTrack?._id;
        if (currentTrackId && state.originalPlaylist.length > 0) {
          const originalIndex = state.originalPlaylist.findIndex(
            (track) => track._id === currentTrackId,
          );
          if (originalIndex !== -1) {
            state.currentTrackIndex = originalIndex;
            state.currentPlaylist = state.originalPlaylist;
          }
        }
      }

      state.isShuffle = newShuffleState;
    },

    nextTrack: (state) => {
      if (state.currentPlaylist.length > 0 && state.currentTrackIndex !== -1) {
        const nextIndex =
          (state.currentTrackIndex + 1) % state.currentPlaylist.length;
        state.currentTrackIndex = nextIndex;
        state.currentTrack = state.currentPlaylist[nextIndex];
        state.currentTime = 0;
        state.isPlay = true;
      }
    },

    prevTrack: (state) => {
      if (state.currentPlaylist.length > 0 && state.currentTrackIndex !== -1) {
        const prevIndex = state.currentTrackIndex - 1;
        state.currentTrackIndex =
          prevIndex < 0 ? state.currentPlaylist.length - 1 : prevIndex;
        state.currentTrack = state.currentPlaylist[state.currentTrackIndex];
        state.currentTime = 0;
        state.isPlay = true;
      }
    },
  },
});

// Вспомогательная функция для перемешивания массива
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const {
  setCurrentTrack,
  setIsPlay,
  setCurrentTime,
  setDuration,
  setVolume,
  setIsLoop,
  setIsShuffle,
  nextTrack,
  prevTrack,
} = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;
