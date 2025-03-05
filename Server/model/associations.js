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
  });
  User.hasMany(Message, {
    foreignKey: 'sender_id',
  });
  User.hasMany(MessageReaction, {
    foreignKey: 'user_id',
  });
  User.belongsToMany(Conversation, {
    through: ConversationParticipant,
    foreignKey: 'user_id',
    otherKey: 'conversation_id',
  });

  // Conversation associations
  Conversation.hasMany(ConversationParticipant, {
    foreignKey: 'conversation_id',
  });
  Conversation.hasMany(Message, {
    foreignKey: 'conversation_id',
  });
  // Add this many-to-many relationship
  Conversation.belongsToMany(User, {
    through: ConversationParticipant,
    foreignKey: 'conversation_id',
    otherKey: 'user_id',
  });

  // ConversationParticipant associations
  ConversationParticipant.belongsTo(Conversation, {
    foreignKey: 'conversation_id',
  });
  ConversationParticipant.belongsTo(User, {
    foreignKey: 'user_id',
  });

  // Message associations
  Message.belongsTo(Conversation, {
    foreignKey: 'conversation_id',
  });
  Message.belongsTo(User, {
    foreignKey: 'sender_id',
  });
  Message.hasMany(MessageReaction, {
    foreignKey: 'message_id',
  });

  // MessageReaction associations
  MessageReaction.belongsTo(Message, {
    foreignKey: 'message_id',
  });
  MessageReaction.belongsTo(User, {
    foreignKey: 'user_id',
  });
};

export default setupAssociations;
