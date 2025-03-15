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

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["online", "offline"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status. Must be 'online' or 'offline'" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    user.last_seen = new Date();
    await user.save();

    return res.status(200).json({
      user_id: user.user_id,
      status: user.status,
      last_seen: user.last_seen,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
