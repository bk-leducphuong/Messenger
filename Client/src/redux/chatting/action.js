import { updateConversationWithNewMessage } from '../recentChat/action';

export const SELECT_CONVERSATION = "SELECT_CONVERSATION";
export const ADD_MESSAGE = "ADD_MESSAGE";
export const MESSAGE_LOADING = "MESSAGE_LOADING";
export const MESSAGE_ERROR = "MESSAGE_ERROR";
export const SEND_MESSAGE = "SEND_MESSAGE";

export const selectConversation = (payload) => ({ type: SELECT_CONVERSATION, payload });
export const addMessage = (payload) => ({ type: ADD_MESSAGE, payload });
export const messageLoading = (payload) => ({ type: MESSAGE_LOADING, payload });
export const messageError = (payload) => ({ type: MESSAGE_ERROR, payload });
export const sendMessage = (payload) => ({ type: SEND_MESSAGE, payload });

export const fetchConversationMessage = (conversationId, socket) => async (dispatch) => {
  dispatch(messageLoading(true));
  const url = import.meta.env.VITE_API_URL + `/conversations/${conversationId}/messages`;
  try {
    let res = await fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
    let data = await res.json();
    dispatch(addMessage(data));
    
    socket.emit("join conversation", conversationId);
  } catch (err) {
    dispatch(messageError(true));
  }
};

export const sendMessageApi = (msg, socket) => async (dispatch) => {
  const url = import.meta.env.VITE_API_URL + `/conversations/${msg.conversationId}/messages`;
  try {
    let res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(msg),
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
    let message = await res.json();

    socket.emit("message:send", message);

    // Update the conversation in recent chats
    dispatch(updateConversationWithNewMessage(message));
    
    // Update the current conversation messages
    dispatch(sendMessage(message));
  } catch (err) {
    console.log(err.message);
  }
};
