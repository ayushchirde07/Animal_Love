const mongoose = require('mongoose')

const animalReportSchema = new mongoose.Schema(
  {
    reportId: { type: String, required: true, unique: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    animalType: { type: String, required: true },
    condition: { type: String, required: true },
    severity: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    video: { type: String },
    location: {
      latitude: { type: String },
      longitude: { type: String },
      note: { type: String },
    },
    status: {
      type: String,
      enum: [
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
      ],
      default: 'SUBMITTED',
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('AnimalReport', animalReportSchema)
