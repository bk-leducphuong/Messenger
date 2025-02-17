const Chat = require("../model/chat");
const User = require("../model/user");

exports.getAllChats = async (req, res) => {
    try {
    let chats = await Chat.findAll({
      where: {
        users: {
          [Sequelize.Op.contains]: [req.user.id]
        }
      },
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: User, as: 'groupAdmin', attributes: { exclude: ['password'] } },
        { model: Message, as: 'latestMessage' }
      ],
      order: [['updatedAt', 'DESC']]
    });

    res.status(200).send(chats);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
exports.createChat = async (req, res) => {
    try {
    const { userId } = req.body;
    let chat = await Chat.findOne({
      where: {
        isGroupChat: false,
        users: {
          [Sequelize.Op.contains]: [req.user.id, userId]
        }
      },
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Message, as: 'latestMessage' }
      ]
    });
    if (chat) {
      return res.status(200).send(chat);
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user.id, userId]
      };

      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({
        where: { id: createdChat.id },
        include: [
          { model: User, attributes: { exclude: ['password'] } }
        ]
      });

      return res.status(200).send(fullChat);
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
exports.createGroupChat = async (req, res) => {
    try {
    let users = req.body.users;
    users.push(req.user.id);

    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user.id
    });

    const createdGroupDetails = await Chat.findOne({
      where: { id: groupChat.id },
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: User, as: 'groupAdmin', attributes: { exclude: ['password'] } }
      ]
    });

    return res.status(200).send(createdGroupDetails);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
exports.renameGroupChat = async (req, res) => {
    try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.update(
      { chatName: chatName },
      { where: { id: chatId }, returning: true }
    );

    if (!updatedChat[1][0]) {
      return res.status(404).send("Chat Not Found");
    } else {
      res.json(updatedChat[1][0]);
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
exports.removeMemberFromGroupChat = async (req, res) => {
    try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findOne({ where: { id: chatId } });
    if (!chat) {
      return res.status(404).send("Chat Not Found");
    }

    chat.users = chat.users.filter(user => user !== userId);
    await chat.save();

    const updatedChat = await Chat.findOne({
      where: { id: chatId },
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: User, as: 'groupAdmin', attributes: { exclude: ['password'] } }
      ]
    });

    res.json(updatedChat);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
exports.addMemberToGroupChat = async (req, res) => {
    try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findOne({ where: { id: chatId } });
    if (!chat) {
      return res.status(404).send("Chat Not Found");
    }

    chat.users.push(userId);
    await chat.save();

    const updatedChat = await Chat.findOne({
      where: { id: chatId },
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: User, as: 'groupAdmin', attributes: { exclude: ['password'] } }
      ]
    });

    res.json(updatedChat);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};