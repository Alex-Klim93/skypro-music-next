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
      }
      if (action.payload.index !== undefined) {
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
      state.isShuffle = action.payload;
    },
    nextTrack: (state) => {
      if (state.currentPlaylist.length > 0 && state.currentTrackIndex !== -1) {
        let nextIndex;
        if (state.isShuffle) {
          do {
            nextIndex = Math.floor(
              Math.random() * state.currentPlaylist.length,
            );
          } while (
            nextIndex === state.currentTrackIndex &&
            state.currentPlaylist.length > 1
          );
        } else {
          nextIndex =
            (state.currentTrackIndex + 1) % state.currentPlaylist.length;
        }
        state.currentTrackIndex = nextIndex;
        state.currentTrack = state.currentPlaylist[nextIndex];
        state.currentTime = 0;
        state.isPlay = true;
      }
    },
    prevTrack: (state) => {
      if (state.currentPlaylist.length > 0 && state.currentTrackIndex !== -1) {
        let prevIndex;
        if (state.isShuffle) {
          do {
            prevIndex = Math.floor(
              Math.random() * state.currentPlaylist.length,
            );
          } while (
            prevIndex === state.currentTrackIndex &&
            state.currentPlaylist.length > 1
          );
        } else {
          prevIndex = state.currentTrackIndex - 1;
          if (prevIndex < 0) prevIndex = state.currentPlaylist.length - 1;
        }
        state.currentTrackIndex = prevIndex;
        state.currentTrack = state.currentPlaylist[prevIndex];
        state.currentTime = 0;
        state.isPlay = true;
      }
    },
  },
});

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
