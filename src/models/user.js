const { DataTypes } = require("sequelize");
const database = require("../config/database");

const User = database.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
  },

  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },

  mobile: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  profilePic: {
    type: DataTypes.STRING,
  },

  otp: {
    type: DataTypes.STRING,
  },

  otpExpires: {
    type: DataTypes.DATE,
  },

  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;