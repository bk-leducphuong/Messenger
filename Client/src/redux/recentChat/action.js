export const CONVERSATION_LOADING = "CONVERSATION_LOADING";
export const CONVERSATION_ERROR = "CONVERSATION_ERROR";
export const ADD_CONVERSATION = "ADD_CONVERSATION";
// export const NEW_CREATED_CONVERSATION = "NEW_CREATED_CONVERSATION";

export const conversationLoading = (payload) => ({
  type: CONVERSATION_LOADING,
  payload,
});
export const conversationError = (payload) => ({
  type: CONVERSATION_ERROR,
  payload,
});
export const conversationResult = (payload) => ({
  type: ADD_CONVERSATION,
  payload,
});
// export const newC = (payload) => ({
//   type: NEW_CREATED_CHAT,
//   payload,
// });

export const getAllConversations = () => async (dispatch) => {
  dispatch(conversationLoading(true));
  const url = import.meta.env.VITE_API_URL + "/conversations";
  try {
    let res = await fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
    let data = await res.json();
    dispatch(conversationResult(data));
  } catch (err) {
    dispatch(conversationError(true));
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
