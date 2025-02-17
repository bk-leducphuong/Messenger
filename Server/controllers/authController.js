const User = require("../model/user");
const jwt = require("jsonwebtoken");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.development" });
}else {
  require("dotenv").config({ path: ".env.production" });
}

exports.login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("emai not exist");
    let match = user.checkPassword(req.body.password);
    if (!match) return res.status(400).send("password is wrong");
    let token = jwt.sign({ user }, process.env.JWT_SECRET_KEY);
    return res.status(200).send({ user, token });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.register = async (req, res) => {
  try {
    let user = await User.create(req.body);
    let token = jwt.sign({ user }, process.env.JWT_SECRET_KEY);
    return res.status(200).send({ user, token });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("emai not exist");
    let token = jwt.sign({ user }, process.env.JWT_SECRET_KEY);
    return res.status(200).send({ user, token });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send('User not found');
    if (!user.checkPassword(req.body.password))
      return res.status(400).send('Incorrect password');
    const hash = await bcrypt.hash(req.body.newPassword, 8);
    user.password = hash;
    await user.save();
    return res.status(200).send('Password reset successfully');
  }catch(error) {
    return res.status(400).send(error.message);
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).send('Unauthorized');
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).send('Unauthorized');
      req.user = decoded;
      return res.status(200).send('Logged out successfully');
    });
  }catch(error) {
    return res.status(400).send(error.message);
  }
};

