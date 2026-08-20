const { Analytics } = require('../models')
const { sequelize } = require('../config/db')

exports.recordEvent = async (eventType, userId, payload = {}) => {
  try {
    await Analytics.create({ eventType, userId, payload })
  } catch (err) {
    console.error('Analytics record error', err)
  }
}

exports.getSummary = async (req, res) => {
  try {
    // aggregate counts by eventType
    const counts = await Analytics.findAll({
      attributes: [
        'eventType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['eventType'],
      raw: true,
    })

    const result = counts.reduce((acc, cur) => {
      acc[cur.eventType] = parseInt(cur.count, 10) || 0
      return acc
    }, {})

    return res.json({ summary: result })
  } catch (err) {
    console.error('Analytics summary error', err)
    return res.status(500).json({ message: 'Server error' })
  }
}
