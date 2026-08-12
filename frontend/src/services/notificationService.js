import api from './api'

export const fetchNotifications = async () => {
  const response = await api.get('/api/notifications')
  return response.data
}

export const markNotificationRead = async (id) => {
  const response = await api.patch(`/api/notifications/${id}/read`)
  return response.data
}
