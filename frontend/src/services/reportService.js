import api from './api'

export const createReport = async (payload) => {
  const response = await api.post('/api/reports', payload)
  return response.data
}

export const fetchReports = async () => {
  const response = await api.get('/api/reports')
  return response.data
}

export const updateReportStatus = async (reportId, status) => {
  const response = await api.patch(`/api/reports/${reportId}/status`, { status })
  return response.data
}

export const fetchReportById = async (id) => {
  const response = await api.get(`/api/reports/${id}`)
  return response.data
}

export const deleteReport = async (id) => {
  const response = await api.delete(`/api/reports/${id}`)
  return response.data
}
