export const AUTH_USER = "AUTH_USER";
export const AUTH_LOADING = "AUTH_LOADING";
export const AUTH_ERROR = "AUTH_ERROR";
export const LOGOUT = "LOGOUT";
export const UPLOAD_PIC = "UPLOAD_PIC";

export const actionPic = (payload) => ({ type: UPLOAD_PIC, payload });
export const authUser = (payload) => ({ type: AUTH_USER, payload });
export const authLoading = (payload) => ({ type: AUTH_LOADING, payload });
export const authError = (payload) => ({ type: AUTH_ERROR, payload });
export const authLogout = () => ({ type: LOGOUT, payload: {} });

export const authRegister = (user) => async (dispatch) => {
  dispatch(authLoading(true));
  try {
    let res = await fetch(import.meta.env.VITE_API_URL + "/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
    let data = await res.json();
    dispatch(authUser(data));
  } catch (err) {
    dispatch(authLoading(false));
    dispatch(authError(true));
  }
};

export const authLogin = (user) => async (dispatch) => {
  dispatch(authLoading(true));
  try {
    let res = await fetch(import.meta.env.VITE_API_URL + "/auth/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
    let data = await res.json();
    dispatch(authUser(data));
  } catch (err) {
    dispatch(authLoading(false));
    dispatch(authError(true));
  }
};

export const logout = () => async (dispatch) => {
  dispatch(authLogout());
};

export const checkAuth = () => async (dispatch) => {
  dispatch(authLoading(true));
  try {
    let res = await fetch(import.meta.env.VITE_API_URL + "/auth/check", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    let data = await res.json();
    dispatch(authUser(data));
  } catch (err) {
    dispatch(authLoading(false));
    dispatch(authError(true));
  }
};  

export const uploadPic = (pic) => async (dispatch) => {
  dispatch(authLoading(true));
  try {
    const url = `https://api.cloudinary.com/v1_1/yasherosion/image/upload`;
    const profile = new FormData();
    profile.append("file", pic);
    profile.append("upload_preset", "chat-app");
    profile.append("cloud_name", "yasherosion");
    let res = await fetch(url, {
      method: "POST",
      body: profile,
    });
    let data = await res.json();
    console.log(data);
    dispatch(actionPic(data.secure_url));
  } catch (error) {
    dispatch(authLoading(false));
    dispatch(authError(true));
    console.log(error.message);
  }
};
