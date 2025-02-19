const {Conversation} = require('../model/conversation');
const {ConversationParticipant} = require('../model/conversationParticipant');

export const createNewConversation = async (req, res) => {
  const { conversation_name, conversation_type } = req.body;
  const conversation = await Conversation.create({
    conversation_name,
    conversation_type,
  });
  return res.status(201).json(conversation);
};

export const getAllConversation = async (req, res) => {
  const conversations = await Conversation.findAll({
    include: [
      {
        model: User,
        as: "participants",
        attributes: ["user_id", "username", "avatar_url"],
      },
    ],
  });
  return res.status(200).json(conversations);
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