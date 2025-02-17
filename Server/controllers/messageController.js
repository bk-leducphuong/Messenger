const Chat = require("../model/chat");
const Message = require("../model/messages");
const User = require("../model/user");


exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { chatId: req.params.chatId },
      include: [
        { model: User, as: "sender", attributes: ["name", "pic", "email"] },
        { model: Chat },
      ],
      order: [["createdAt", "ASC"]],
    });
    return res.status(200).send(messages);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400).send("Invalid data passed into request");
  }

  const newMessage = {
    senderId: req.user.id,
    content: content,
    chatId: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await Message.findOne({
      where: { id: message.id },
      include: [
        { model: User, as: "sender", attributes: ["name", "pic"] },
        { model: Chat },
      ],
    });
    message = await Chat.findOne({
      where: { id: chatId },
      include: [{ model: User, attributes: ["name", "pic", "email"] }],
    });

    await Chat.update(
      { latestMessageId: message.id },
      { where: { id: chatId } }
    );

    return res.status(200).send(message);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
