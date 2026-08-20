const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Notification = sequelize.define(
  'Notification',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.id
      },
    },
  },
  {
    tableName: 'notifications',
    timestamps: true,
  },
)

module.exports = Notification
