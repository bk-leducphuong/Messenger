const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');

const User = sequelize.define('user', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pic: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  timestamps: true,
  versionKey: false,
});

User.beforeSave(async (user, options) => {
  if (user.changed('password')) {
    const hash = await bcrypt.hash(user.password, 8);
    user.password = hash;
  }
});

User.prototype.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = User;
