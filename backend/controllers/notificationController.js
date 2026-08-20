const { Notification } = require('../models')

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user && req.user.userId
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    })
    return res.json({ notifications })
  } catch (error) {
    console.error('Get notifications error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params
    const notif = await Notification.findByPk(id)
    if (!notif) return res.status(404).json({ message: 'Notification not found' })
    notif.read = true
    await notif.save()
    return res.json({ notification: notif })
  } catch (error) {
    console.error('Mark as read error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
