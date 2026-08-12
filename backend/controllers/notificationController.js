const Notification = require('../models/Notification')

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user && req.user.userId
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 })
    return res.json({ notifications })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params
    const notif = await Notification.findByIdAndUpdate(id, { read: true }, { new: true })
    if (!notif) return res.status(404).json({ message: 'Notification not found' })
    return res.json({ notification: notif })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
