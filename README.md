# 🏥 SaludClara - Frontend

Frontend de SaludClara, un asistente médico inteligente con IA.

## 🚀 Características

- 🤖 **Chat de Diagnóstico con IA** - Consulta síntomas con inteligencia artificial
- 📖 **Traductor Médico** - Convierte términos médicos complejos en lenguaje simple
- 📄 **Análisis de Documentos** - Sube y analiza documentos médicos con OCR
- 📅 **Sistema de Citas** - Reserva citas médicas en línea
- 🗺️ **Mapa Interactivo** - Encuentra hospitales y clínicas en El Salvador
- 🔐 **Autenticación** - Login con Google o email/contraseña

## 🛠️ Tecnologías

- HTML5 + TailwindCSS
- JavaScript Vanilla
- Leaflet.js (mapas)
- Tesseract.js (OCR)
- PDF.js (lectura de PDFs)
- EmailJS (envío de correos)
- Google Sign-In

## 📦 Instalación

### Opción 1: Servidor Simple (Recomendado)

```bash
# Con Python
python -m http.server 5500

# Con Node.js
npx http-server -p 5500

# Con PHP
php -S localhost:5500
```

### Opción 2: Live Server (VS Code)

1. Instala la extensión "Live Server" en VS Code
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

## ⚙️ Configuración

### 1. Configurar Backend

Edita `script.js` y `auth.js` para apuntar a tu backend:

```javascript
const API_URL = 'http://localhost:3000'; // Cambia según tu backend
```

Si despliegas en producción, cambia a tu URL de backend:

```javascript
const API_URL = 'https://tu-backend.render.com';
```

### 2. Configurar Google Sign-In (Opcional)

El Google Client ID se obtiene automáticamente del backend.

### 3. Configurar EmailJS (Opcional)

Para enviar correos de confirmación de citas:

1. Crea una cuenta en [EmailJS](https://www.emailjs.com/)
2. Edita `script.js` y busca la función `enviarCorreoConfirmacion`
3. Agrega tus credenciales de EmailJS

## 🌐 Despliegue

### Netlify (Recomendado)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Desplegar
netlify deploy --prod --dir=.
```

### Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel --prod
```

### GitHub Pages

1. Ve a Settings → Pages
2. Selecciona la rama `main`
3. Carpeta: `/` (root)
4. Guarda y espera el despliegue

## 📁 Estructura

```
frontend/
├── index.html          # Página principal
├── script.js           # Lógica principal
├── auth.js             # Sistema de autenticación
├── styles.css          # Estilos personalizados
├── .gitignore          # Archivos ignorados por Git
└── README.md           # Este archivo
```

## 🔗 Backend

Este frontend requiere el backend de SaludClara para funcionar:

👉 [Backend Repository](https://github.com/edwardlemus840-cloud/Backend-API-para-SaludClara---Asistente-m-dico-con-IA-)

## ⚠️ Importante

Este asistente **NO reemplaza** la consulta médica profesional. Siempre consulta con un doctor certificado para diagnósticos y tratamientos.

## 📝 Licencia

MIT License

## 👨‍💻 Autor

**Edward Lemus**
- GitHub: [@edwardlemus840-cloud](https://github.com/edwardlemus840-cloud)
