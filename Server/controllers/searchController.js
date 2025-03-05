import { Op } from "sequelize";
import { User, Conversation, ConversationParticipant } from "../model/index.js";


export const searchUsersAndConversations = async (req, res) => {
  try {
    const { query } = req.query;

    // Search for users
    const users = await User.findAll({
      where: {
        username: { [Op.like]: `%${query}%` },
        user_id: { [Op.ne]: req.user.user_id }, // Exclude current user
      },
      attributes: ["user_id", "username", "avatar_url"], // Only return necessary fields
    }); 

    // Search for conversations
    const conversations = await Conversation.findAll({
      attributes: ["conversation_id", "conversation_name", "conversation_type"],
      where: {
        conversation_name: {
          [Op.like]: `%${query}%`,
        },
      },
      include: [
        {
          model: ConversationParticipant,
          where: {
            user_id: req.user.user_id,
          },
        },
      ],  
    });

    return res.status(200).json({
      users,
      conversations,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
