const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value) {
        this.setDataValue('email', value ? value.toLowerCase().trim() : '')
      },
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('Citizen', 'NGO', 'Volunteer', 'Veterinarian', 'Authority', 'Admin'),
      defaultValue: 'Citizen',
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.fullName
      },
    },
    phone: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.mobile
      },
    },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.id
      },
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  },
)

module.exports = User
