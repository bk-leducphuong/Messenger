import {
  SEARCH_REQUEST,
  SEARCH_SUCCESS,
  SEARCH_ERROR
} from './action';

const initialState = {
  users: [],
  conversations: [],
  loading: false,
  error: null
};

export const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case SEARCH_SUCCESS:
      return {
        ...state,
        users: action.payload.users,
        conversations: action.payload.conversations,
        loading: false,
        error: null
      };
    
    case SEARCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    default:
      return state;
  }
};
