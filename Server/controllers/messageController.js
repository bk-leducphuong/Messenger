import { Message } from '../model/index.js';
export const sendMessage = async (req, res) => {
    try {
        const { conversationId, messageType, messageText, fileUrl } = req.body;
        if (!conversationId || !messageType || !messageText) {
            return res.status(400).send({message: "Missing required information!"})
        }

        const messageObj = await Message.create({
            conversation_id: conversationId,
            sender_id: req.user.user_id,
            message_type: messageType,
            message_text: messageText,
            file_url: fileUrl,
        });

        return res.status(201).json(messageObj);
    } catch (error) {
        return res.status(500).send({message: "Internal Server Error!"});
    }
};

export const getMessages = async (req, res) => {
    const { conversationId } = req.params;
    const messages = await Message.findAll({
        where: { conversation_id: conversationId },
        order: [["created_at", "ASC"]],
    });
    return res.status(200).json(messages);
};

export const editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { messageText } = req.body;

        if (!messageId || !messageText) {
            return res.status(400).send({ message: "Missing required information!" });
        }

        const message = await Message.findByPk(messageId);
        
        if (!message) {
            return res.status(404).send({ message: "Message not found!" });
        }

        // Check if user is the message sender
        if (message.sender_id !== req.user.user_id) {
            return res.status(403).send({ message: "Unauthorized to edit this message!" });
        }

        await message.update({
            message_text: messageText,
            is_edited: true
        });

        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error!" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findByPk(messageId);
        
        if (!message) {
            return res.status(404).send({ message: "Message not found!" });
        }

        // Check if user is the message sender
        if (message.sender_id !== req.user.user_id) {
            return res.status(403).send({ message: "Unauthorized to delete this message!" });
        }

        await message.destroy();

        return res.status(200).send({ message: "Message deleted successfully!" });
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error!" });
    }
};

export const addReaction = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { reaction } = req.body;

        if (!messageId || !reaction) {
            return res.status(400).send({ message: "Missing required information!" });
        }

        const message = await Message.findByPk(messageId);
        
        if (!message) {
            return res.status(404).send({ message: "Message not found!" });
        }

        // Assuming reactions are stored as an array in the message model
        let reactions = message.reactions || [];
        reactions.push({
            user_id: req.user.user_id,
            reaction: reaction,
            created_at: new Date()
        });

        await message.update({ reactions });

        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error!" });
    }
};

export const removeReaction = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { reaction } = req.body;

        if (!messageId) {
            return res.status(400).send({ message: "Missing required information!" });
        }

        const message = await Message.findByPk(messageId);
        
        if (!message) {
            return res.status(404).send({ message: "Message not found!" });
        }

        // Filter out the reaction from the user
        let reactions = message.reactions || [];
        reactions = reactions.filter(r => 
            !(r.user_id === req.user.user_id && (!reaction || r.reaction === reaction))
        );

        await message.update({ reactions });

        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error!" });
    }
};