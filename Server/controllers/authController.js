import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../model/index.js";
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.development" });
} else {
  dotenv.config({ path: ".env.production" });
}

export const checkAuth = async (req, res) => {
  try {
    const user = req.user; // {user_id, username, email}
    return res.status(200).send({ user: user });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({
      attributes: ['user_id', 'username', 'email'],
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).send({ message: "Email is wrong or not exist" });
    }

    // const validPass = await bcrypt.compare(password, user.password);
    // // if password is wrong
    // if (!validPass) {
    //   return res.status(400).send({ message: "Password is wrong" });
    // }

    // create access token and refresh token
    const Atoken = jwt.sign(
      { user_id: user.user_id, username: user.username, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    res.cookie("access_token", Atoken, {
      httpOnly: true, // Allow client-side JS to read
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    const Rtoken = jwt.sign(
      { user_id: user.user_id, username: user.username, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    res.cookie("refresh_token", Rtoken, {
      httpOnly: true, // Allow client-side JS to read
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    await User.update({ refresh_token: Rtoken }, { where: { user_id: user.user_id } });

    return res.status(200).send({ user: user});
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let existUser = await User.findOne({ email: email });
    if (existUser)
    {
      return res.status(400).send({ message: "Email already exist" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(200).send({ user: user });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("emai not exist");
    let token = jwt.sign({ user }, process.env.JWT_SECRET_KEY);
    return res.status(200).send({ user, token });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const resetPassword = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("User not found");
    if (!user.checkPassword(req.body.password))
      return res.status(400).send("Incorrect password");
    const hash = await bcrypt.hash(req.body.newPassword, 8);
    user.password = hash;
    await user.save();
    return res.status(200).send("Password reset successfully");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).send("Unauthorized");
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).send("Unauthorized");
      req.user = decoded;
      return res.status(200).send("Logged out successfully");
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
