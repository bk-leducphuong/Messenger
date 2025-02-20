import User from "../model/user.js";

export const getUserInfo = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json(user);
};

export const updateUserInfo = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = name;
  user.email = email;
  await user.save();

  return res.status(200).json(user);
};

