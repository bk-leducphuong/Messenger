import dotenv from "dotenv";
import User from "../model/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.development" });
} else {
  dotenv.config({ path: ".env.production" });
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let queryResult = await User.findOne({
      attributes: ['id', 'name', 'email'],
      where: {
        email: email,
      },
    });

    let user = queryResult.dataValues;
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
      { id: user.id, name: user.name, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    res.cookie("access_token", Atoken, {
      httpOnly: true, // Allow client-side JS to read
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    const Rtoken = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    res.cookie("refresh_token", Rtoken, {
      httpOnly: true, // Allow client-side JS to read
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    await User.update({ refreshToken: Rtoken }, { where: { id: user.id } });

    return res.status(200).send({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let existUser = await User.findOne({ email: email });
    if (existUser)
      return res.status(400).send({ message: "Email already exist" });
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let queryResult = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    let user = queryResult.dataValues;
    return res.status(200).send({ user });
  } catch (err) {
    console.log(err.message);
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
