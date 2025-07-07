import axios from 'axios'

const API = axios.create({
  baseURL: 'https://track2crack-backend.onrender.com/api', // 🔁 Replace with your backend URL
})

// Add token to headers automatically if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API
