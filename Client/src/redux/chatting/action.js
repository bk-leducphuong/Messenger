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
    
    socket.emit("join chat", id);
  } catch (err) {
    dispatch(messageError(true));
  }
};

export const sendMessageApi = (msg, token, socket) => async (dispatch) => {
  const url = process.env.API_URL + "/message";
  try {
    let res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(msg),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    let data = await res.json();
    socket.emit("new message", data);
    dispatch(sendMessage(data));
  } catch (err) {
    console.log(err.message);
  }
};
