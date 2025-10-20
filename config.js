// ============================================
// CONFIGURACIÓN DE LA APLICACIÓN
// ============================================

// ✅ URL del backend en Render
const BACKEND_URL_PRODUCCION = 'https://saludclara-backend.onrender.com';

// Detectar automáticamente si estamos en desarrollo o producción
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : BACKEND_URL_PRODUCCION;

console.log('🌐 Entorno:', window.location.hostname === 'localhost' ? 'DESARROLLO' : 'PRODUCCIÓN');
console.log('🔗 API URL:', API_URL);
