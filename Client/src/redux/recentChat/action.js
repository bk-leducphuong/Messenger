export const RECENT_LOADING = "RECENT_LOADING";
export const RECENT_ERROR = "RECENT_ERROR";
export const ADD_RECENT_CHAT = "ADD_RECENT_CHAT";
export const NEW_CREATED_CHAT = "NEW_CREATED_CHAT";
import { selectChat } from "../Chatting/action";
export const recentLoading = (payload) => ({ type: RECENT_LOADING, payload });
export const recentError = (payload) => ({ type: RECENT_ERROR, payload });
export const recentChatResult = (payload) => ({
  type: ADD_RECENT_CHAT,
  payload,
});
export const newCreatedChat = (payload) => ({
  type: NEW_CREATED_CHAT,
  payload,
});

export const makeRecentChatApi = () => async (dispatch) => {
  dispatch(recentLoading(true));
  const url = import.meta.env.VITE_API_URL + "/chat";
  try {
    let res = await fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
    let data = await res.json();
    dispatch(recentChatResult(data));
  } catch (err) {
    dispatch(recentError(true));
    console.log(err.message);
  }
};

export const makeNewGroup = (group_data) => async (dispatch) => {
  dispatch(recentLoading(true));
  const url = process.env.API_URL + "/chat/group";
  try {
    let res = await fetch(url, {
      method: "post",
      body: JSON.stringify(group_data),
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
    let data = await res.json();
    dispatch(newCreatedChat(data));
  } catch (err) {
    dispatch(recentError(true));
    console.log(err.message);
  }
};

export const accessChat = (userId, recentchat) => async (dispatch) => {
  dispatch(recentLoading(true));
  const url = process.env.API_URL + "/chat";
  try {
    let res = await fetch(url, {
      method: "post",
      body: JSON.stringify({ userId }),
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
    let data = await res.json();
    console.log(data);
    if (!recentchat.find((el) => el._id === data._id)) {
      dispatch(newCreatedChat(data));
      dispatch(
        selectChat({
          isGroupChat: data.isGroupChat,
          index: 0,
          user: data.users.find((el) => el._id == userId),
          _id: data._id,
          chatName: data.chatName,
        })
      );
      return;
    }
    dispatch(recentLoading(false));
    dispatch(
      selectChat({
        isGroupChat: data.isGroupChat,
        index: 0,
        user: data.users.find((el) => el._id == userId),
        _id: data._id,
        chatName: data.chatName,
      })
    );
  } catch (err) {
    dispatch(recentError(true));
    console.log(err.message);
  }
};
