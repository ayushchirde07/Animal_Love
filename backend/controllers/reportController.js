const { AnimalReport, User, Notification } = require('../models')
const { recordEvent } = require('./analyticsController')

exports.createReport = async (req, res) => {
  try {
    const { animalType, condition, severity, description, latitude, longitude, locationNote, images, video } = req.body

    const reportId = `AG-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`
    const report = await AnimalReport.create({
      reportId,
      reporterId: req.user ? req.user.userId : null,
      animalType,
      condition,
      severity,
      description,
      images: images || [],
      video: video || null,
      latitude: latitude ? String(latitude) : null,
      longitude: longitude ? String(longitude) : null,
      locationNote: locationNote || null,
    })

    // Fetch report with reporter info for consistent client response
    const fullReport = await AnimalReport.findOne({
      where: { id: report.id },
      include: [{ model: User, as: 'reporter', attributes: ['id', 'fullName', 'email', 'role'] }],
    })

    // Emit real-time update for connected NGO dashboards
    try {
      const io = req.app && req.app.get && req.app.get('io')
      if (io) {
        io.emit('newReport', fullReport || report)
      }
    } catch (emitError) {
      console.error('Failed to emit newReport event', emitError)
    }

    // create notifications for NGO users (broadcast-style entry)
    try {
      await Notification.create({
        userId: req.user ? req.user.userId : null,
        title: 'New rescue request',
        body: `${report.animalType} reported (${report.reportId})`,
        meta: { reportId: report.reportId },
      })
    } catch (notifErr) {
      console.error('Failed to create notification', notifErr)
    }

    // record analytics event
    try {
      await recordEvent('report_created', req.user ? req.user.userId : null, {
        reportId: report.reportId,
        animalType: report.animalType,
      })
    } catch (analyticsErr) {
      console.error('Failed to record analytics event', analyticsErr)
    }

    return res.status(201).json({ message: 'Report created', report: fullReport || report })
  } catch (error) {
    console.error('Create report error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.getReports = async (req, res) => {
  try {
    const reports = await AnimalReport.findAll({
      include: [{ model: User, as: 'reporter', attributes: ['id', 'fullName', 'email', 'role'] }],
      order: [['createdAt', 'DESC']],
    })
    return res.json({ reports })
  } catch (error) {
    console.error('Get reports error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.getReportById = async (req, res) => {
  try {
    const report = await AnimalReport.findOne({
      where: { reportId: req.params.id },
      include: [{ model: User, as: 'reporter', attributes: ['id', 'fullName', 'email', 'role'] }],
    })
    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }
    return res.json({ report })
  } catch (error) {
    console.error('Get report by id error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.deleteReport = async (req, res) => {
  try {
    const report = await AnimalReport.findOne({ where: { reportId: req.params.id } })
    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }
    await report.destroy()
    return res.json({ message: 'Report deleted' })
  } catch (error) {
    console.error('Delete report error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.updateReportStatus = async (req, res) => {
  if (req.user?.role !== 'NGO') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const { status } = req.body
  if (!status) {
    return res.status(400).json({ message: 'Status is required' })
  }

  const validStatuses = [
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
  ]

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' })
  }

  try {
    const report = await AnimalReport.findOne({ where: { reportId: req.params.id } })

    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }

    report.status = status
    await report.save()

    const fullReport = await AnimalReport.findOne({
      where: { reportId: req.params.id },
      include: [{ model: User, as: 'reporter', attributes: ['id', 'fullName', 'email', 'role'] }],
    })

    // record analytics about status change
    try {
      await recordEvent('report_status_updated', req.user ? req.user.userId : null, {
        reportId: report.reportId,
        status,
      })
    } catch (analyticsErr) {
      console.error('Failed to record analytics event', analyticsErr)
    }

    return res.json({ message: 'Report status updated', report: fullReport || report })
  } catch (error) {
    console.error('Update report status error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
