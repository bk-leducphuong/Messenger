import {
  CONVERSATION_ERROR,
  CONVERSATION_LOADING,
  ADD_CONVERSATION,
  // NEW_CREATED_CONVERSATION,
} from './action';

const initState = {
  allConversations: [],
  loading: true,
  error: false,
};
export const recentChatReducer = (store = initState, { type, payload }) => {
  switch (type) {
    case ADD_CONVERSATION:
      return {
        ...store,
        allConversations: payload,
        loading: false,
        error: false,
      };
    // case NEW_CREATED_CHAT:
    //   return {
    //     ...store,
    //     recent_chat: [payload, ...store.recent_chat],
    //     loading: false,
    //     error: false,
    //   };
    case CONVERSATION_ERROR:
      return { ...store, error: payload };
    case CONVERSATION_LOADING:
      return { ...store, loading: payload };
    default:
      return store;
  }
};
