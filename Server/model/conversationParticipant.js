const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

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
    sequelize,
    timestamps: false,
    primaryKey: ["conversation_id", "user_id"],
  }
);

module.exports = ConversationParticipant;
