import api from './api'

export const fetchAnalyticsSummary = async () => {
  const response = await api.get('/api/analytics/summary')
  return response.data
}
