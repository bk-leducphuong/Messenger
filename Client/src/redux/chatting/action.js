import { updateConversationWithNewMessage } from '../recentChat/action';

export const SELECT_CONVERSATION = "SELECT_CONVERSATION";
export const ADD_MESSAGE = "ADD_MESSAGE";
export const MESSAGE_LOADING = "MESSAGE_LOADING";
export const MESSAGE_ERROR = "MESSAGE_ERROR";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const IMAGE_UPLOAD_LOADING = "IMAGE_UPLOAD_LOADING";

export const selectConversation = (payload) => ({ type: SELECT_CONVERSATION, payload });
export const addMessage = (payload) => ({ type: ADD_MESSAGE, payload });
export const messageLoading = (payload) => ({ type: MESSAGE_LOADING, payload });
export const messageError = (payload) => ({ type: MESSAGE_ERROR, payload });
export const sendMessage = (payload) => ({ type: SEND_MESSAGE, payload });
export const imageUploadLoading = (payload) => ({ type: IMAGE_UPLOAD_LOADING, payload });

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

export const uploadImage = (file) => async (dispatch) => {
  dispatch(imageUploadLoading(true));
  
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('image', file);
    
    // Upload to server
    const url = import.meta.env.VITE_API_URL + `/conversations/messages/upload`;
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include', 
    });
    
    if (!res.ok) {
      throw new Error('Failed to upload image');
    }
    
    const data = await res.json();
    dispatch(imageUploadLoading(false));
    return data.imageUrl; // Return the image URL
  } catch (error) {
    console.error('Error uploading image:', error);
    dispatch(imageUploadLoading(false));
    throw error;
  }
};

export const sendMessageApi = (msg, socket) => async (dispatch) => {
  // If message contains a file, upload it first
  if (msg.file) {
    try {
      const imageUrl = await dispatch(uploadImage(msg.file));
      msg.fileUrl = imageUrl;
      delete msg.file; // Remove the file object before sending to API
    } catch (error) {
      console.error('Error in image upload:', error);
      return; // Exit if image upload fails
    }
  }
  
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
