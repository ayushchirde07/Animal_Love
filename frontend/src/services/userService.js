import api from './api'

export const fetchProfileStats = async () => {
  const response = await api.get('/api/users/profile/stats')
  return response.data
}

export const updateProfile = async (formData) => {
  const response = await api.patch('/api/users/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const changePassword = async (payload) => {
  const response = await api.patch('/api/users/change-password', payload)
  return response.data
}
