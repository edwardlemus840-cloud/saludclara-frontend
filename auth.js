// ============================================
// SISTEMA DE AUTENTICACIÓN
// ============================================

// Detectar automáticamente si estamos en desarrollo o producción
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://saludclara-backend.onrender.com'; // ✅ URL de Render configurada

const GOOGLE_CLIENT_ID = ''; // Se configurará desde el backend

// Estado de autenticación
let usuarioActual = null;
let tokenActual = null;

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay sesión guardada
    verificarSesionGuardada();
    
    // Inicializar Google Sign-In
    inicializarGoogleSignIn();
});

// ============================================
// GESTIÓN DE SESIÓN
// ============================================
function verificarSesionGuardada() {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    
    if (token && usuario) {
        tokenActual = token;
        usuarioActual = JSON.parse(usuario);
        actualizarUIUsuario();
    }
}

function guardarSesion(token, usuario) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    tokenActual = token;
    usuarioActual = usuario;
    actualizarUIUsuario();
}

function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    tokenActual = null;
    usuarioActual = null;
    actualizarUIUsuario();
    mostrarSeccion('inicio');
    mostrarNotificacion('Sesión cerrada exitosamente', 'success');
}

function actualizarUIUsuario() {
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    
    if (usuarioActual) {
        // Usuario logueado
        loginBtn.classList.add('hidden');
        userMenu.classList.remove('hidden');
        
        // Actualizar nombre y avatar
        document.getElementById('user-name').textContent = usuarioActual.nombre.split(' ')[0];
        
        const avatar = document.getElementById('user-avatar');
        if (usuarioActual.foto_perfil) {
            avatar.src = usuarioActual.foto_perfil;
        } else {
            // Avatar por defecto con iniciales
            const iniciales = usuarioActual.nombre.split(' ').map(n => n[0]).join('').toUpperCase();
            avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(iniciales)}&background=4A90E2&color=fff&size=128`;
        }
    } else {
        // Usuario no logueado
        loginBtn.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }
}

function toggleUserDropdown() {
    document.getElementById('user-dropdown').classList.toggle('hidden');
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', function(event) {
    const userMenu = document.getElementById('user-menu');
    const dropdown = document.getElementById('user-dropdown');
    
    if (userMenu && !userMenu.contains(event.target)) {
        dropdown.classList.add('hidden');
    }
});

// ============================================
// MODAL DE AUTENTICACIÓN
// ============================================
function mostrarModalLogin() {
    // Mostrar el modal nuevo con tabs
    document.getElementById('modal-auth').classList.remove('hidden');
    cambiarTabAuth('login');
}

function cerrarModalAuth() {
    document.getElementById('modal-auth').classList.add('hidden');
    limpiarFormularios();
}

// Alias para compatibilidad con código anterior
function cerrarModalLogin() {
    cerrarModalAuth();
}

function cambiarTabAuth(tipo) {
    const tabLogin = document.getElementById('tab-login');
    const tabRegistro = document.getElementById('tab-registro');
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');
    
    if (tipo === 'login') {
        tabLogin.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
        tabLogin.classList.remove('text-gray-500');
        tabRegistro.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
        tabRegistro.classList.add('text-gray-500');
        
        formLogin.classList.remove('hidden');
        formRegistro.classList.add('hidden');
    } else {
        tabRegistro.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
        tabRegistro.classList.remove('text-gray-500');
        tabLogin.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
        tabLogin.classList.add('text-gray-500');
        
        formRegistro.classList.remove('hidden');
        formLogin.classList.add('hidden');
    }
}

function limpiarFormularios() {
    document.getElementById('login-form').reset();
    document.getElementById('registro-form').reset();
}

// ============================================
// LOGIN LOCAL
// ============================================
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            guardarSesion(data.token, data.usuario);
            cerrarModalAuth();
            mostrarNotificacion(`¡Bienvenido ${data.usuario.nombre}!`, 'success');
        } else {
            mostrarNotificacion(data.error || 'Error al iniciar sesión', 'error');
        }
    } catch (error) {
        console.error('Error en login:', error);
        mostrarNotificacion('Error de conexión. Verifica que el backend esté corriendo.', 'error');
    }
}

// ============================================
// REGISTRO LOCAL
// ============================================
async function handleRegistro(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('registro-nombre').value;
    const email = document.getElementById('registro-email').value;
    const telefono = document.getElementById('registro-telefono').value;
    const password = document.getElementById('registro-password').value;
    const passwordConfirm = document.getElementById('registro-password-confirm').value;
    
    // Validar contraseñas
    if (password !== passwordConfirm) {
        mostrarNotificacion('Las contraseñas no coinciden', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/auth/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, telefono, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            guardarSesion(data.token, data.usuario);
            cerrarModalAuth();
            mostrarNotificacion(`¡Cuenta creada! Bienvenido ${data.usuario.nombre}!`, 'success');
        } else {
            mostrarNotificacion(data.error || 'Error al crear cuenta', 'error');
        }
    } catch (error) {
        console.error('Error en registro:', error);
        mostrarNotificacion('Error de conexión. Verifica que el backend esté corriendo.', 'error');
    }
}

// ============================================
// GOOGLE SIGN-IN
// ============================================
function inicializarGoogleSignIn() {
    // Obtener el GOOGLE_CLIENT_ID del backend
    fetch(`${API_URL}/api/health`)
        .then(res => res.json())
        .then(data => {
            if (data.google_client_id) {
                inicializarBotonesGoogle(data.google_client_id);
            }
        })
        .catch(err => console.error('Error al obtener Google Client ID:', err));
}

function inicializarBotonesGoogle(clientId) {
    if (!window.google) {
        console.warn('Google Sign-In no está disponible');
        return;
    }
    
    // Inicializar Google Identity Services
    google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCallback
    });
    
    // Renderizar botón en login
    google.accounts.id.renderButton(
        document.getElementById('google-login-button'),
        {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left'
        }
    );
    
    // Renderizar botón en registro
    google.accounts.id.renderButton(
        document.getElementById('google-registro-button'),
        {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signup_with',
            shape: 'rectangular',
            logo_alignment: 'left'
        }
    );
}

async function handleGoogleCallback(response) {
    try {
        const res = await fetch(`${API_URL}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: response.credential })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            guardarSesion(data.token, data.usuario);
            cerrarModalAuth();
            mostrarNotificacion(`¡Bienvenido ${data.usuario.nombre}!`, 'success');
        } else {
            mostrarNotificacion(data.error || 'Error al autenticar con Google', 'error');
        }
    } catch (error) {
        console.error('Error en Google Sign-In:', error);
        mostrarNotificacion('Error de conexión con Google', 'error');
    }
}

// ============================================
// VERIFICAR AUTENTICACIÓN
// ============================================
function verificarAutenticacionYMostrar(seccion) {
    if (!usuarioActual) {
        mostrarNotificacion('Debes iniciar sesión para acceder a esta función', 'warning');
        mostrarModalLogin();
        return false;
    }
    
    mostrarSeccion(seccion);
    return true;
}

function estaAutenticado() {
    return usuarioActual !== null;
}

function obtenerToken() {
    return tokenActual;
}

function obtenerUsuario() {
    return usuarioActual;
}

// ============================================
// NOTIFICACIONES
// ============================================
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notif = document.createElement('div');
    notif.className = `fixed top-4 right-4 z-[100] px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 translate-x-0 ${
        tipo === 'success' ? 'bg-green-500 text-white' :
        tipo === 'error' ? 'bg-red-500 text-white' :
        tipo === 'warning' ? 'bg-yellow-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    
    notif.innerHTML = `
        <div class="flex items-center space-x-3">
            <span class="text-xl">${
                tipo === 'success' ? '✓' :
                tipo === 'error' ? '✕' :
                tipo === 'warning' ? '⚠' :
                'ℹ'
            }</span>
            <span class="font-medium">${mensaje}</span>
        </div>
    `;
    
    document.body.appendChild(notif);
    
    // Animar entrada
    setTimeout(() => notif.classList.add('animate-bounce'), 10);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notif.style.transform = 'translateX(400px)';
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 300);
    }, 4000);
}
