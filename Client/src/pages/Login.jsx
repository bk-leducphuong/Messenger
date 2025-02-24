import "../assets/styles/login/auth.css";
import avatar from "../assets/images/profileimg.png";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link, Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { authLogin } from "../redux/auth/action";

function isValidEmail(email) {
  // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // return re.test(String(email).toLowerCase());
  return true;
}

export const LoginComp = () => {
  const { user, loading, error, isAuthenticated } = useSelector((store) => store.user);
  
  const [loginData, setLoginData] = useState({
    email: "", // Remove default values
    password: "",
  });
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!loginData.email || !loginData.password) {
      // Add error handling for empty fields
      return;
    }
    if (!isValidEmail(loginData.email)) {
      // Add email format validation
      return;
    }
    dispatch(authLogin(loginData));
  };

  // return statement must be behind all the hooks
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="auth-cont">
      <div>
        <h2 className="auth-heading">Welcome back!</h2>

        <div className="details-cont">
          <p>Email</p>
          <input name="email" onChange={handleChange} className="inputcom" />

          <p>Password</p>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            className="inputcom"
            autoComplete="current-password"
          />

          {loading ? (
            <ColorButton disabled>
              <CircularProgress style={{ color: "white" }} />
            </ColorButton>
          ) : (
            <ColorButton onClick={handleSubmit}>Continue</ColorButton>
          )}

          <p className="auth-link" onClick={handleSubmit}>
            Don't have an account? Click continue to login as guest
          </p>
          <p className="contract">
            Need an account ?
            <Link className="auth-link" to={"/register"}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export const ColorButton = styled(Button)(() => ({
  color: "white",
  fontSize: "20px",
  textTransform: "none",
  backgroundColor: "#5865f2",
  "&:hover": {
    backgroundColor: "#3a45c3",
  },
}));
