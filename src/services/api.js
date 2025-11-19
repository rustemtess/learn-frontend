// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://80d6f4f86866.ngrok-free.app'

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('access_token')
}

// Helper function to make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',  // Skip ngrok browser warning
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
    throw new Error(error.detail || `HTTP error! status: ${response.status}`)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null
  }

  return response.json()
}

// ============= Auth APIs =============
export const authAPI = {
  // Login with email and password
  login: async (email, password) => {
    const formData = new URLSearchParams()
    formData.append('username', email) // OAuth2 uses 'username' field
    formData.append('password', password)

    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'ngrok-skip-browser-warning': 'true',
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }))
      throw new Error(error.detail || 'Login failed')
    }

    const data = await response.json()
    // Store token in localStorage
    localStorage.setItem('access_token', data.access_token)
    return data
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token')
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken()
  },
}

// ============= User APIs =============
export const userAPI = {
  // Create a new user (registration)
  create: async (userData) => {
    return fetchWithAuth('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  // Get all users
  list: async () => {
    return fetchWithAuth('/users')
  },

  // Get current user profile
  me: async () => {
    return fetchWithAuth('/users/me')
  },

  // Get user by ID
  getById: async (userId) => {
    return fetchWithAuth(`/users/${userId}`)
  },

  // Update user
  update: async (userId, userData) => {
    return fetchWithAuth(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    })
  },
}

// ============= Lesson APIs =============
export const lessonAPI = {
  // Get all lessons with optional filters
  list: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.level) params.append('level', filters.level)
    if (filters.published_only !== undefined) params.append('published_only', filters.published_only)

    const queryString = params.toString()
    return fetchWithAuth(`/lessons${queryString ? `?${queryString}` : ''}`)
  },

  // Get lesson by ID
  getById: async (lessonId) => {
    return fetchWithAuth(`/lessons/${lessonId}`)
  },

  // Create new lesson (requires mentor/admin role)
  create: async (lessonData) => {
    return fetchWithAuth('/lessons', {
      method: 'POST',
      body: JSON.stringify(lessonData),
    })
  },

  // Update lesson (requires mentor/admin role)
  update: async (lessonId, lessonData) => {
    return fetchWithAuth(`/lessons/${lessonId}`, {
      method: 'PATCH',
      body: JSON.stringify(lessonData),
    })
  },

  // Delete lesson (requires mentor/admin role)
  delete: async (lessonId) => {
    return fetchWithAuth(`/lessons/${lessonId}`, {
      method: 'DELETE',
    })
  },
}

// ============= Enrollment APIs =============
export const enrollmentAPI = {
  // Enroll in a lesson
  enroll: async (lessonId) => {
    return fetchWithAuth('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ lesson_id: lessonId }),
    })
  },

  // Get current user's enrollments
  myEnrollments: async () => {
    return fetchWithAuth('/enrollments/me')
  },

  // Update enrollment progress
  updateProgress: async (enrollmentId, progressPercent) => {
    return fetchWithAuth(`/enrollments/${enrollmentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ progress_percent: progressPercent }),
    })
  },
}

// ============= Quiz APIs =============
export const quizAPI = {
  // Create a new quiz (requires mentor/admin role)
  create: async (quizData) => {
    return fetchWithAuth('/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData),
    })
  },

  // Get all quizzes
  list: async () => {
    return fetchWithAuth('/quizzes')
  },

  // Get all quizzes for a lesson
  getByLesson: async (lessonId) => {
    return fetchWithAuth(`/quizzes/lesson/${lessonId}`)
  },

  // Get quiz by ID
  getById: async (quizId) => {
    return fetchWithAuth(`/quizzes/${quizId}`)
  },

  // Update quiz (requires mentor/admin role)
  update: async (quizId, quizData) => {
    return fetchWithAuth(`/quizzes/${quizId}`, {
      method: 'PATCH',
      body: JSON.stringify(quizData),
    })
  },

  // Submit quiz answers
  submit: async (quizId, answers) => {
    return fetchWithAuth(`/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    })
  },
}

// ============= Admin APIs =============
export const adminAPI = {
  // Get stats
  getStats: async () => {
    return fetchWithAuth('/admin/stats')
  },

  // Get all users
  listUsers: async (skip = 0, limit = 50) => {
    return fetchWithAuth(`/admin/users?skip=${skip}&limit=${limit}`)
  },

  // Get user progress
  getUserProgress: async (userId) => {
    return fetchWithAuth(`/admin/users/${userId}/progress`)
  },

  // Get lessons stats
  getLessonsStats: async () => {
    return fetchWithAuth('/admin/lessons/stats')
  },
}

// ============= Health Check =============
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/`, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
    }
  })
  return response.json()
}

// Export all APIs
export default {
  auth: authAPI,
  user: userAPI,
  lesson: lessonAPI,
  enrollment: enrollmentAPI,
  quiz: quizAPI,
  admin: adminAPI,
  healthCheck,
}
