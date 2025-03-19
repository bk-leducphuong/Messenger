import {
  CONVERSATION_ERROR,
  CONVERSATION_LOADING,
  ADD_CONVERSATION,
  UPDATE_CONVERSATION_WITH_NEW_MESSAGE,
  // NEW_CREATED_CONVERSATION,
} from './action';

const initState = {
  allConversations: [],
  loading: true,
  error: false,
};

// Helper function to sort conversations by latest message timestamp
const sortConversationsByLatestMessage = (conversations) => {
  return [...conversations].sort((a, b) => {
    // If no latest message, push to the end
    if (!a.latest_message) return 1;
    if (!b.latest_message) return -1;
    
    // Sort by created_at timestamp (newest first)
    return new Date(b.latest_message.created_at) - new Date(a.latest_message.created_at);
  });
};

export const recentChatReducer = (store = initState, { type, payload }) => {
  switch (type) {
    case ADD_CONVERSATION:
      return {
        ...store,
        allConversations: sortConversationsByLatestMessage(payload),
        loading: false,
        error: false,
      };
    case UPDATE_CONVERSATION_WITH_NEW_MESSAGE:
      // Find the conversation that received the new message
      const existingConversationIndex = store.allConversations.findIndex(
        conv => conv.conversation_id === payload.conversation_id
      );
      
      if (existingConversationIndex !== -1) {
        // Create a copy of the conversations array
        const updatedConversations = [...store.allConversations];
        // Update the conversation with the latest message
        const updatedConversation = {
          ...updatedConversations[existingConversationIndex],
          latest_message: {
            ...payload,
            created_at: new Date().toISOString() // Ensure the timestamp is updated
          },
        };
        
        // Remove the conversation from its current position
        updatedConversations.splice(existingConversationIndex, 1);
        // Add it to the top of the list
        updatedConversations.unshift(updatedConversation);
        
        return {
          ...store,
          allConversations: updatedConversations,
        };
      }
      return store;
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
