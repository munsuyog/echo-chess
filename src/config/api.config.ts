export const API_CONFIG = {
  BASE_URL: import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};