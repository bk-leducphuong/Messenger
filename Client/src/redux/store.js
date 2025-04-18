import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authReducer } from "./auth/reducer";
import { conversationReducer } from "./chatting/reducer";
import { notyficationReducer } from "./notification/reducer";
import { recentChatReducer } from "./recentChat/reducer";
import { searchReducer } from "./search/reducer";
import { activeUserReducer } from './activeUser/reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user']
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const loggerMiddleware = (store) => (next) => (action) => {
  if (typeof action === "function") {
    return action(store.dispatch);
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    user: persistedReducer,
    search: searchReducer,
    recentChat: recentChatReducer,
    conversation: conversationReducer,
    notification: notyficationReducer,
    activeUser: activeUserReducer
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }).concat(loggerMiddleware),
});

export const persistor = persistStore(store);
