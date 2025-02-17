const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('Message', {
  sender: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users', // name of the target model
      key: 'id', // key in the target model
    }
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true
  },
  chat: {
    type: DataTypes.INTEGER,
    references: {
      model: 'chats', // name of the target model
      key: 'id', // key in the target model
    }
  },
  readBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users', // name of the target model
      key: 'id', // key in the target model
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = Message;
