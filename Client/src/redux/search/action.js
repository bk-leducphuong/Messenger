export const SEARCH_REQUEST = "SEARCH_REQUEST";
export const SEARCH_SUCCESS = "SEARCH_SUCCESS";
export const SEARCH_ERROR = "SEARCH_ERROR";

export const searchRequest = () => ({
  type: SEARCH_REQUEST
});

export const searchSuccess = (data) => ({
  type: SEARCH_SUCCESS,
  payload: data
});

export const searchError = (error) => ({
  type: SEARCH_ERROR,
  payload: error
});

export const searchUsersAndConversations = (query) => async (dispatch) => {
  try {
    dispatch(searchRequest());

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/search?query=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          "content-type": "application/json",
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();
    dispatch(searchSuccess(data));
  } catch (error) {
    dispatch(searchError(error.message));
  }
};