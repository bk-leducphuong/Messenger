import express from 'express';
import * as conversationController from '../controllers/conversationController.js';
import * as messageController from '../controllers/messageController.js';
import  authenticate  from '../middleware/authenticate.js';

const router = express.Router();

// root route: /api/conversations
router.post("/", authenticate, conversationController.createNewConversation); // create new conversation
router.get("/", authenticate, conversationController.getAllConversation); // get user conversation
router.get("/:conversationId", authenticate, conversationController.getConversationDetails); // get conversation detail
router.post("/:conversationId/participants", authenticate, conversationController.addParticipants); // add participants into group
router.delete("/:conversationId/participants/:userId", authenticate, conversationController.removeParticipant); // remove participants from group

router.post("/:conversationId/messages", authenticate, messageController.sendMessage); // send message
router.get("/:conversationId/messages", authenticate, messageController.getMessages); // get messages
router.put("/:conversationId/messages/:messageId", authenticate, messageController.editMessage); // edit message
router.delete("/:conversationId/messages/:messageId", authenticate, messageController.deleteMessage); // delete message
router.post("/:conversationId/messages/:messageId/reactions", authenticate, messageController.addReaction); // add reaction
router.delete("/:conversationId/messages/:messageId/reactions/:reactionId", authenticate, messageController.removeReaction); // remove reaction

export default router;