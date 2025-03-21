import { DataTypes, Model } from "sequelize";
import sequelize from '../config/db.js';
import Conversation from "./conversation.js";
import User from "./user.js";

const ConversationParticipant = sequelize.define(
  "conversation_participant",
  {
    conversation_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Conversation,
        key: "conversation_id",
      },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    role: {
      type: DataTypes.STRING(20),
      defaultValue: "member",
      validate: {
        isIn: [["member", "admin"]],
      },
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    last_read_message_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    modelName: 'conversation_participant',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['conversation_id', 'user_id']
      }
    ]
  }
);

export default ConversationParticipant;
