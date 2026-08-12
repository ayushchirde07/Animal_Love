const mongoose = require('mongoose')

const analyticsSchema = new mongoose.Schema(
  {
    eventType: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    payload: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Analytics', analyticsSchema)
