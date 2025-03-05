// Import all models
import User from './user.js';
import Conversation from './conversation.js';
import ConversationParticipant from './conversationParticipant.js';
import Message from './message.js';
import MessageReaction from './messageReaction.js';

// Define all associations
const setupAssociations = () => {
  // User associations
  User.hasMany(ConversationParticipant, {
    foreignKey: 'user_id',
    as: 'participants'
  });
  User.hasMany(Message, {
    foreignKey: 'sender_id',
    as: 'sentMessages'
  });
  User.hasMany(MessageReaction, {
    foreignKey: 'user_id',
    as: 'reactions'
  });

  // Conversation associations
  Conversation.hasMany(ConversationParticipant, {
    foreignKey: 'conversation_id',
    as: 'participants'
  });
  Conversation.hasMany(Message, {
    foreignKey: 'conversation_id',
    as: 'messages'
  });

  // ConversationParticipant associations
  ConversationParticipant.belongsTo(Conversation, {
    foreignKey: 'conversation_id',
    as: 'conversation'
  });
  ConversationParticipant.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  // Message associations
  Message.belongsTo(Conversation, {
    foreignKey: 'conversation_id',
    as: 'conversation'
  });
  Message.belongsTo(User, {
    foreignKey: 'sender_id',
    as: 'sender'
  });
  Message.hasMany(MessageReaction, {
    foreignKey: 'message_id',
    as: 'reactions'
  });

  // MessageReaction associations
  MessageReaction.belongsTo(Message, {
    foreignKey: 'message_id',
    as: 'message'
  });
  MessageReaction.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

export default setupAssociations;
