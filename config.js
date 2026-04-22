/**
 * Configurazione API - Hugging Face
 * ⚠️ IMPORTANTE: Sostituisci con il tuo token Hugging Face (gratuito)
 * Registrati gratuitamente: https://huggingface.co/join
 * Crea un token qui: https://huggingface.co/settings/tokens
 */

const CONFIG = {
  // Hugging Face API Configuration (fallback)
  HF_API_URL_TEXT: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
  HF_TOKEN: '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',
  
  // Google Gemini API Configuration (primary)
  GEMINI_API_KEY: 'AIzaSyD4J5Qk3j4sP8r2v3m7Q1n6w8x9z0yX2t',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  
  // Local proxy server
  PROXY_URL: 'http://localhost:3001/api/hf-proxy',
  
  // Google Search API for research
  GOOGLE_API_KEY: 'AIzaSyD4J5Qk3j4sP8r2v3m7Q1n6w8x9z0yX2t',
  SEARCH_ENGINE_ID: '017576662512726037846:ofuaa_lk1x8',
  
  // App settings
  APP_NAME: 'BrainPlay',
  VERSION: '1.0.0',
  
  // AI settings
  AI_PROVIDER: 'gemini', // 'gemini' or 'mock'
  USE_REAL_AI: true
};
