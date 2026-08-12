const Analytics = require('../models/Analytics')

exports.recordEvent = async (eventType, userId, payload = {}) => {
  try {
    await Analytics.create({ eventType, user: userId, payload })
  } catch (err) {
    console.error('Analytics record error', err)
  }
}

exports.getSummary = async (req, res) => {
  try {
    // aggregate simple counts for main event types
    const counts = await Analytics.aggregate([
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
    ])

    const result = counts.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {})
    return res.json({ summary: result })
  } catch (err) {
    console.error('Analytics summary error', err)
    return res.status(500).json({ message: 'Server error' })
  }
}
