const is_dev = process.env.NODE_ENV === 'development'

export const apiURL = is_dev ? 'http://localhost:8000' : 'https://api.kcal.ansengarvin.com'