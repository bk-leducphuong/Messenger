import ConversationParticipant from '../model/conversationParticipant.js';
import Conversation from '../model/conversation.js';
import Message from '../model/message.js';
import User from '../model/user.js';
import { Op } from 'sequelize';

export const createNewConversation = async (req, res) => {
  const { conversation_name, conversation_type } = req.body;
  const conversation = await Conversation.create({
    conversation_name,
    conversation_type,
  });
  return res.status(201).json(conversation);
};

export const getAllConversation = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let allConversations = [];
    
    // get all conversation id where user is participant
    const conversationParticipant = await ConversationParticipant.findAll({
      attributes: ["conversation_id"],
      where: { user_id: req.user.user_id },
    });

    for (let i = 0; i < conversationParticipant.length; i++) {
      const conversation = await Conversation.findByPk(
        conversationParticipant[i].conversation_id
      );
      const participants = await ConversationParticipant.findAll({
        attributes: ["user_id"],
        where: { conversation_id: conversationParticipant[i].conversation_id, user_id: { [Op.ne]: req.user.user_id } },
      });
      const latestMessage = await Message.findOne({
        attributes: ["message_id", "message_text", "message_type", "sender_id", "created_at", "updated_at"],
        where: { conversation_id: conversationParticipant[i].conversation_id },
        order: [["created_at", "DESC"]],
      });

      if (conversation.conversation_type === "direct") {
        const participant = await User.findOne({
          attributes: ["user_id", "username", "avatar_url"],
          where: { user_id: participants[0].user_id },
        });
        conversation.conversation_name = participant.username;
        participants[0] = participant;
      }

      allConversations.push({
        conversation_id: conversation.conversation_id,
        conversation_name: conversation.conversation_name,
        conversation_type: conversation.conversation_type, // 'group' or 'direct'
        participants: participants,
        latest_message: latestMessage,
      });
    }
    return res.status(200).json(allConversations);
  }catch(error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getConversationDetails = async (req, res) => {
  const { conversationId } = req.params;
  const conversation = await Conversation.findByPk(conversationId, {
    include: [
      {
        model: User,
        as: "participants",
        attributes: ["user_id", "username", "avatar_url"],
      },
    ],
  });
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }
  return res.status(200).json(conversation);
};

export const addParticipants = async (req, res) => {
  const { conversationId } = req.params;
  const { userId } = req.body;  
  const conversation = await Conversation.findByPk(conversationId);
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }
  const participant = await User.findByPk(userId);
  if (!participant) {
    return res.status(404).json({ message: "User not found" });
  }
  conversation.participants.push(participant);
  await conversation.save();
  return res.status(200).json(conversation);
};

export const removeParticipant = async (req, res) => {
  const { conversationId } = req.params;
  const { userId } = req.body;
  const conversation = await Conversation.findByPk(conversationId);
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }
  const participant = await User.findByPk(userId);
  if (!participant) {
    return res.status(404).json({ message: "User not found" });
  }
  conversation.participants = conversation.participants.filter(
    (participant) => participant.user_id !== userId
  );
  await conversation.save();
  return res.status(200).json(conversation);
};


