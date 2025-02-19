const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Conversation = sequelize.define(
  "conversation",
  {
    conversation_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    conversation_name: {
      type: DataTypes.STRING(100),
    },
    conversation_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [["direct", "group"]],
      },
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

module.exports = Conversation;
