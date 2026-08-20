const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { User, AnimalReport } = require('../models')

const buildProfileImageUrl = (req, imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  return `${req.protocol}://${req.get('host')}${imagePath}`
}

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, city, phone, removeProfileImage } = req.body
    if (!fullName || !city) {
      return res.status(400).json({ message: 'Full name and city are required.' })
    }

    const user = await User.findByPk(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    user.fullName = fullName.trim()
    user.city = city.trim()
    user.mobile = phone ? phone.trim() : user.mobile

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`
    } else if (removeProfileImage === 'true' || removeProfileImage === true) {
      user.profileImage = null
    }

    await user.save()

    const responseUser = {
      id: user.id,
      _id: user.id,
      name: user.fullName,
      fullName: user.fullName,
      email: user.email,
      phone: user.mobile,
      mobile: user.mobile,
      city: user.city,
      role: user.role,
      profileImage: buildProfileImageUrl(req, user.profileImage),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return res.json({ message: 'Profile updated successfully.', user: responseUser })
  } catch (error) {
    console.error('Update profile error:', error)
    return res.status(500).json({ message: 'Unable to update profile. Please try again.' })
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required.' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters.' })
    }

    const user = await User.findByPk(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' })
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    user.password = hashed
    await user.save()

    return res.json({ message: 'Password updated successfully.' })
  } catch (error) {
    console.error('Change password error:', error)
    return res.status(500).json({ message: 'Unable to update password. Please try again.' })
  }
}

exports.getProfileStats = async (req, res) => {
  try {
    const userId = req.user.userId
    const totalReports = await AnimalReport.count({ where: { reporterId: userId } })
    const pendingReports = await AnimalReport.count({
      where: {
        reporterId: userId,
        status: {
          [Op.in]: [
            'SUBMITTED',
            'UNDER_REVIEW',
            'ACCEPTED',
            'VOLUNTEER_ASSIGNED',
            'ON_THE_WAY',
            'TREATMENT_STARTED',
          ],
        },
      },
    })
    const completedReports = await AnimalReport.count({
      where: {
        reporterId: userId,
        status: { [Op.in]: ['RECOVERED', 'COMPLETED'] },
      },
    })

    return res.json({ totalReports, pendingReports, completedReports })
  } catch (error) {
    console.error('Profile stats error:', error)
    return res.status(500).json({ message: 'Unable to load profile statistics.' })
  }
}
