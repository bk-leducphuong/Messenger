export const SET_USER_ACTIVE = "SET_USER_ACTIVE";

export const setUserActive = (activeUsers) => ({
  type: SET_USER_ACTIVE,
  payload: activeUsers
});