import { SET_USER_ACTIVE } from "./action";

const initialState = {
  activeUsers: {}, // Change to plain object instead of Map
  loading: false,
  error: null
};

export const activeUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_ACTIVE:
      return {
        ...state,
        activeUsers: {
          ...state.activeUsers,
          [action.payload.userId]: {
            status: action.payload.status,
            timestamp: action.payload.timestamp
          }
        }
      };
      
    default:
      return state;
  }
};
