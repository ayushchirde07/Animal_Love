const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String },
    city: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['Citizen', 'NGO', 'Volunteer', 'Veterinarian', 'Authority', 'Admin'],
      default: 'Citizen',
    },
    profileImage: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
)

userSchema.virtual('name')
  .get(function () {
    return this.fullName
  })
  .set(function (value) {
    this.fullName = value
  })

userSchema.virtual('phone')
  .get(function () {
    return this.mobile
  })
  .set(function (value) {
    this.mobile = value
  })

module.exports = mongoose.model('User', userSchema)
