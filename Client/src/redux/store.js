import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { authReducer } from "./auth/reducer";
import { chattingReducer } from "./chatting/reducer";
import { notyficationReducer } from "./notification/reducer";
import { recentChatReducer } from "./recentChat/reducer";
import { searchReducer } from "./searching/reducer";

const loggerMiddleware = (store) => (next) => (action) => {
  if (typeof action === "function") {
    return action(store.dispatch);
  }
  next(action);
};

export const store = configureStore({
  reducer: {
    user: authReducer,
    search: searchReducer,
    recentChat: recentChatReducer,
    chatting: chattingReducer,
    notification: notyficationReducer,
  },
  middleware: [...getDefaultMiddleware(), loggerMiddleware],
});
