import sequelize from '../config/db.js';
import User from './user.js';
import Conversation from './conversation.js';
import ConversationParticipant from './conversationParticipant.js';
import Message from './message.js';
import MessageReaction from './messageReaction.js';
import setupAssociations from './associations.js';

// Setup associations
setupAssociations();

// Export everything
export {
  sequelize,
  User,
  Conversation,
  ConversationParticipant,
  Message,
  MessageReaction
};
