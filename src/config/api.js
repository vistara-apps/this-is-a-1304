// API Configuration
export const API_CONFIG = {
  // OpenAI Configuration
  OPENAI: {
    BASE_URL: 'https://api.openai.com/v1',
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 500,
    TEMPERATURE: 0.7
  },
  
  // Stripe Configuration
  STRIPE: {
    PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
    PRICE_ID_MONTHLY: import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY || 'price_...',
    get SUCCESS_URL() {
      return typeof window !== 'undefined' ? `${window.location.origin}/subscription/success` : '/subscription/success'
    },
    get CANCEL_URL() {
      return typeof window !== 'undefined' ? `${window.location.origin}/subscription/cancel` : '/subscription/cancel'
    }
  },
  
  // Pinata Configuration
  PINATA: {
    BASE_URL: 'https://api.pinata.cloud',
    GATEWAY_URL: 'https://gateway.pinata.cloud/ipfs'
  },
  
  // Airstack Configuration
  AIRSTACK: {
    BASE_URL: 'https://api.airstack.xyz/gql',
    ENDPOINT: '/graphql'
  }
}

// Environment variables validation
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'VITE_OPENAI_API_KEY',
    'VITE_STRIPE_PUBLISHABLE_KEY',
    'VITE_PINATA_API_KEY',
    'VITE_PINATA_SECRET_KEY'
  ]
  
  const missing = requiredEnvVars.filter(envVar => !import.meta.env[envVar])
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing)
    return false
  }
  
  return true
}

// API Headers
export const getHeaders = (service) => {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  switch (service) {
    case 'openai':
      headers['Authorization'] = `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      break
    case 'pinata':
      headers['pinata_api_key'] = import.meta.env.VITE_PINATA_API_KEY
      headers['pinata_secret_api_key'] = import.meta.env.VITE_PINATA_SECRET_KEY
      break
    case 'airstack':
      headers['Authorization'] = import.meta.env.VITE_AIRSTACK_API_KEY
      break
  }
  
  return headers
}
