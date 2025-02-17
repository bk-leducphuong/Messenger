const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Chat = sequelize.define('Chat', {
  chatName: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
  },
  isGroupChat: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  users: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // Assuming user IDs are integers
    allowNull: false,
  },
  latestMessage: {
    type: DataTypes.INTEGER, // Assuming message IDs are integers
    allowNull: true,
  },
  groupAdmin: {
    type: DataTypes.INTEGER, // Assuming user IDs are integers
    allowNull: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

module.exports = Chat;
