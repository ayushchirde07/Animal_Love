const express = require('express')
const {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  deleteReport,
} = require('../controllers/reportController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', authMiddleware, createReport)
router.get('/', authMiddleware, getReports)
router.get('/:id', authMiddleware, getReportById)
router.patch('/:id/status', authMiddleware, updateReportStatus)
router.delete('/:id', authMiddleware, deleteReport)

module.exports = router
