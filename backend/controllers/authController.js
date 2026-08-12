const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.register = async (req, res) => {
  try {
    const { name, fullName, email, phone, mobile, city, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()
    const userName = (name || fullName || '').trim()
    const userPhone = (phone || mobile || '').trim()

    if (!userName || !normalizedEmail || !password || !city?.trim()) {
      return res.status(400).json({ message: 'Name, email, city, and password are required.' })
    }

    const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const existingUser = await User.findOne({
      email: { $regex: `^${escapedEmail}$`, $options: 'i' },
    })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      fullName: userName,
      email: normalizedEmail,
      mobile: userPhone,
      city: city.trim(),
      password: hashedPassword,
      role: 'Citizen',
    })

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        phone: user.mobile,
        city: user.city,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const user = await User.findOne({
      email: { $regex: `^${escapedEmail}$`, $options: 'i' },
    })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
        profileImage: user.profileImage,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

const buildProfileImageUrl = (req, imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  return `${req.protocol}://${req.get('host')}${imagePath}`
}

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const profileImage = buildProfileImageUrl(req, user.profileImage)
    return res.json({
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        phone: user.mobile,
        city: user.city,
        role: user.role,
        profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
