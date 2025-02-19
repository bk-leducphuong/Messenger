const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");
const messageController = require("../controllers/messageController");

// root route: /api/conversations
router.post("/", conversationController.createNewConversation); // create new conversation
router.get("/", conversationController.getAllConversation); // get user conversation
router.get("/:conversationId", conversationController.getConversationDetails); // get conversation detail
router.post("/:conversationId/participants", conversationController.addParticipants); // add participants into group
router.delete("/:conversationId/participants/:userId", conversationController.removeParticipant); // remove participants from group

router.post("/:conversationId/messages", messageController.sendMessage); // send message
router.get("/:conversationId/messages", messageController.getMessages); // get messages
router.put("/:conversationId/messages/:messageId", messageController.editMessage); // edit message
router.delete("/:conversationId/messages/:messageId", messageController.deleteMessage); // delete message
router.post("/:conversationId/messages/:messageId/reactions", messageController.addReaction); // add reaction
router.delete("/:conversationId/messages/:messageId/reactions/:reactionId", messageController.removeReaction); // remove reaction

module.exports = router;