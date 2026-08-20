const User = require('./User')
const AnimalReport = require('./AnimalReport')
const Notification = require('./Notification')
const Analytics = require('./Analytics')

// Associations
User.hasMany(AnimalReport, { foreignKey: 'reporterId', as: 'reports' })
AnimalReport.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' })

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' })
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' })

User.hasMany(Analytics, { foreignKey: 'userId', as: 'analytics' })
Analytics.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = {
  User,
  AnimalReport,
  Notification,
  Analytics,
}
