import Message from '../model/message.js';

export const sendMessage = (req, res) => {
    const { conversationId, messageType, messageText, fileUrl } = req.body;
    const messageObj = new Message({
        conversation_id: conversationId,
        sender_id: req.user.user_id,
        message_type: messageType,
        message_text: messageText,
        file_url: fileUrl,
    });
    messageObj.save();
    return res.status(200).json(messageObj);
};

export const getMessages = async (req, res) => {
    const { conversationId } = req.params;
    const messages = await Message.findAll({
        where: { conversation_id: conversationId },
        order: [["created_at", "ASC"]],
    });
    return res.status(200).json(messages);
};

export const editMessage = (req, res) => {

};

export const deleteMessage = (req, res) => {

};

export const addReaction = (req, res) => {

};

export const removeReaction = (req, res) => {

};