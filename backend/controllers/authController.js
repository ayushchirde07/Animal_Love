const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '')

const toPublicUser = (user) => ({
  id: user.id,
  _id: user.id,
  name: user.fullName,
  fullName: user.fullName,
  email: user.email,
  phone: user.mobile || '',
  mobile: user.mobile || '',
  city: user.city || '',
  role: user.role,
  profileImage: user.profileImage || null,
})

const findUserByEmail = async (email) => {
  if (!email) return null
  return User.findOne({
    where: {
      email: email.trim().toLowerCase(),
    },
  })
}

exports.register = async (req, res) => {
  try {
    const { name, fullName, email, phone, mobile, city, password, role } = req.body
    const normalizedEmail = normalizeText(email).toLowerCase()
    const userName = normalizeText(name || fullName)
    const userPhone = normalizeText(phone || mobile)
    const userCity = normalizeText(city)
    const userRole = role === 'NGO' ? 'NGO' : 'Citizen'

    if (!userName || !normalizedEmail || typeof password !== 'string' || !password || !userCity) {
      return res.status(400).json({ message: 'Name, email, city, and password are required.' })
    }

    const existingUser = await findUserByEmail(normalizedEmail)
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      fullName: userName,
      email: normalizedEmail,
      mobile: userPhone,
      city: userCity,
      password: hashedPassword,
      role: userRole,
    })

    return res.status(201).json({
      message: 'User created successfully',
      user: toPublicUser(user),
    })
  } catch (error) {
    console.error('Register error:', error)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email already in use' })
    }
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = normalizeText(email).toLowerCase()

    if (!normalizedEmail || typeof password !== 'string' || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await findUserByEmail(normalizedEmail)
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret_jwt_key',
      { expiresIn: '7d' },
    )

    return res.json({
      token,
      user: toPublicUser(user),
    })
  } catch (error) {
    console.error('Login error:', error)
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
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] },
    })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const profileImage = buildProfileImageUrl(req, user.profileImage)
    return res.json({
      user: {
        id: user.id,
        _id: user.id,
        name: user.fullName,
        fullName: user.fullName,
        email: user.email,
        phone: user.mobile,
        mobile: user.mobile,
        city: user.city,
        role: user.role,
        profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    console.error('Me error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
