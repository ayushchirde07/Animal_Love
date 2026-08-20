const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const AnimalReport = sequelize.define(
  'AnimalReport',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reportId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    reporterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    animalType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    severity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const raw = this.getDataValue('images')
        if (Array.isArray(raw)) return raw
        if (typeof raw === 'string') {
          try {
            return JSON.parse(raw)
          } catch (e) {
            return [raw]
          }
        }
        return []
      },
    },
    video: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    locationNote: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          latitude: this.latitude,
          longitude: this.longitude,
          note: this.locationNote,
        }
      },
      set(val) {
        if (val) {
          if (val.latitude !== undefined) this.setDataValue('latitude', val.latitude)
          if (val.longitude !== undefined) this.setDataValue('longitude', val.longitude)
          if (val.note !== undefined) this.setDataValue('locationNote', val.note)
        }
      },
    },
    status: {
      type: DataTypes.ENUM(
        'SUBMITTED',
        'UNDER_REVIEW',
        'ACCEPTED',
        'REJECTED',
        'VOLUNTEER_ASSIGNED',
        'ON_THE_WAY',
        'RESCUED',
        'AT_VET',
        'TREATMENT_STARTED',
        'RECOVERED',
        'COMPLETED',
        'CANCELLED',
      ),
      defaultValue: 'SUBMITTED',
    },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.id
      },
    },
  },
  {
    tableName: 'animal_reports',
    timestamps: true,
  },
)

module.exports = AnimalReport
