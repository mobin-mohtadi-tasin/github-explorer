import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const fetchProfile = (username) => api.get(`/user/${username}`).then(r => r.data)
export const fetchRepo = (username, repo) => api.get(`/user/${username}/repo/${repo}`).then(r => r.data)
export const searchUsers = (q, page = 1) => api.get(`/search?q=${encodeURIComponent(q)}&page=${page}`).then(r => r.data)
export const fetchTrending = (language = 'All', timeRange = 'weekly') => api.get(`/trending?language=${language}&timeRange=${timeRange}`).then(r => r.data)
export const fetchOpportunities = (languages = '') => api.get(`/opportunities?languages=${languages}`).then(r => r.data)
export const fetchJobs = () => api.get('/jobs').then(r => r.data)
