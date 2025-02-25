import {
  ADD_MESSAGE,
  MESSAGE_ERROR,
  MESSAGE_LOADING,
  SELECT_CONVERSATION,
  SEND_MESSAGE,
} from "./action";

const initState = {
  activeConversation: {},
  messages: [],
  loading: false,
  error: false,
};
export const conversationReducer = (store = initState, { type, payload }) => {
  switch (type) {
    case SELECT_CONVERSATION:
      return {
        ...store,
        activeConversation: payload,
        loading: false,
        error: false,
      };
    case SEND_MESSAGE:
      return {
        ...store,
        messages: [...store.messages, payload],
        loading: false,
        error: false,
      };
    case ADD_MESSAGE:
      return { ...store, messages: payload, loading: false, error: false };
    case MESSAGE_LOADING:
      return { ...store, loading: payload };
    case MESSAGE_ERROR:
      return { ...store, error: payload };
    default:
      return store;
  }
};
