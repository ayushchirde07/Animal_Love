import api from './api'

export const fetchVolunteers = () =>
  api.get('/api/users/volunteers').then((res) => res.data)

export const addVolunteer = (payload) =>
  api.post('/api/users/volunteers', payload).then((res) => res.data)

export const removeVolunteer = (id) =>
  api.delete(`/api/users/volunteers/${id}`).then((res) => res.data)
