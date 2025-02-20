import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";
import Conversation from "./conversation.js";

const Message = sequelize.define(
  "message",
  {
    message_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Conversation,
        key: "conversation_id",
      },
      onDelete: "CASCADE",
    },
    sender_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "user_id",
      },
      onDelete: "SET NULL",
    },
    message_text: {
      type: DataTypes.TEXT,
    },
    message_type: {
      type: DataTypes.STRING(20),
      defaultValue: "text",
      validate: {
        isIn: [["text", "image", "file", "system"]],
      },
    },
    file_url: {
      type: DataTypes.TEXT,
    },
    is_edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
);

export default Message;
