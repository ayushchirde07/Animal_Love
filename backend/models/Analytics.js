const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Analytics = sequelize.define(
  'Analytics',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    payload: {
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
    tableName: 'analytics',
    timestamps: true,
  },
)

module.exports = Analytics
