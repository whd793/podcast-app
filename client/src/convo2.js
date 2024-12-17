// audioplayerSlice
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openplayer: false,
  type: 'audio',
  episode: null,
  podid: null,
  currenttime: 0,
  index: 0,
};

const audioplayer = createSlice({
  name: 'audioplayer',
  initialState,
  reducers: {
    openPlayer: (state, action) => {
      state.openplayer = true;
      state.type = action.payload.type;
      state.episode = action.payload.episode;
      state.podid = action.payload.podid;
      state.currenttime = action.payload.currenttime;
      state.index = action.payload.index;
    },
    closePlayer: (state) => {
      state.openplayer = false;
    },
    setCurrentTime: (state, action) => {
      state.currenttime = action.payload.currenttime;
    },
  },
});

export const { openPlayer, closePlayer, setCurrentTime } = audioplayer.actions;

export default audioplayer.reducer;


// setSigninSlice
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  opensi: false,
};

const signin = createSlice({
  name: 'signin',
  initialState,
  reducers: {
    openSignin: (state, action) => {
      state.opensi = true;
    },
    closeSignin: (state) => {
      state.opensi = false;
    },
  },
});

export const { openSignin, closeSignin } = signin.actions;

export default signin.reducer;


// snackbarSlice
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  message: '',
  severity: 'success',
};

const snackbar = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    openSnackbar: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    closeSnackbar: (state) => {
      state.open = false;
    },
  },
});

export const { openSnackbar, closeSnackbar } = snackbar.actions;

export default snackbar.reducer;


// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import snackbarReducer from './snackbarSlice';
import audioReducer from './audioplayerSlice';
import signinReducer from './setSigninSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  snackbar: snackbarReducer,
  audioplayer: audioReducer,
  signin: signinReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// userSlice
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload.user;
      localStorage.setItem('podstreamtoken', action.payload.token);
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
      localStorage.removeItem('token');
    },
    verified: (state, action) => {
      if (state.currentUser) {
        state.currentUser.verified = action.payload;
      }
    },
    displayPodcastFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    subscription: (state, action) => {
      if (state.currentUser.subscribedUsers.includes(action.payload)) {
        state.currentUser.subscribedUsers.splice(
          state.currentUser.subscribedUsers.findIndex(
            (channelId) => channelId === action.payload
          ),
          1
        );
      } else {
        state.currentUser.subscribedUsers.push(action.payload);
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  displayPodcastFailure,
  subscription,
  verified,
} = userSlice.actions;

export default userSlice.reducer;


// videoplayerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openvideo: false,
  videoepisode: null,
  videopodid: null,
};

const videoplayer = createSlice({
  name: 'videoplayer',
  initialState,
  reducers: {
    openVideoPlayer: (state, action) => {
      state.openvideo = true;
      state.videoepisode = action.payload.videoepisode;
      state.videopodid = action.payload.videopodid;
    },
    closeVideoPlayer: (state) => {
      state.openvideo = false;
    },
  },
});

export const { openVideoPlayer, closeVideoPlayer } = videoplayer.actions;

export default videoplayer.reducer;
