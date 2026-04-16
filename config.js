/**
 * Configurazione API - Hugging Face
 * ⚠️ IMPORTANTE: Sostituisci con il tuo token Hugging Face (gratuito)
 * Registrati gratuitamente: https://huggingface.co/join
 * Crea un token qui: https://huggingface.co/settings/tokens
 */

const CONFIG = {
  HF_TOKEN: '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',
  HF_API_URL_VISION: 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
  HF_API_URL_TEXT: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
  // Proxy server locale per evitare problemi CORS
  PROXY_URL: 'http://localhost:3001/api/hf-proxy'
};
