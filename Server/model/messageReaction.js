import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const MessageReaction = sequelize.define(
  "message_reaction",
  {
    message_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Message,
        key: "message_id",
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
    reaction: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: false,
    primaryKey: ["message_id", "user_id", "reaction"],
  }
);

export default MessageReaction;
