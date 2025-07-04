const audio = document.getElementById("intro-audio");
const intro = document.getElementById("intro-screen");

const ocultarIntro = () => {
  intro.classList.add("hide-intro");
  setTimeout(() => {
    intro.remove();
  }, 1000);
};

document.addEventListener("DOMContentLoaded", () => {
  audio.addEventListener("canplaythrough", () => {
    document.addEventListener("click", () => {
      audio.play().catch(err => console.warn("Audio bloqueado:", err));
    }, { once: true });
  });
});

// --- Autenticación ---
const showLoginBtn = document.getElementById('show-login');
const showRegisterBtn = document.getElementById('show-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginMsg = document.getElementById('login-message');
const registerMsg = document.getElementById('register-message');

showLoginBtn.addEventListener('click', () => {
  showLoginBtn.classList.add('active');
  showRegisterBtn.classList.remove('active');
  loginForm.style.display = '';
  registerForm.style.display = 'none';
  loginMsg.textContent = '';
  registerMsg.textContent = '';
});
showRegisterBtn.addEventListener('click', () => {
  showRegisterBtn.classList.add('active');
  showLoginBtn.classList.remove('active');
  registerForm.style.display = '';
  loginForm.style.display = 'none';
  loginMsg.textContent = '';
  registerMsg.textContent = '';
});

// --- Mostrar usuario logueado y cerrar sesión ---
const userLoggedDiv = document.getElementById('user-logged');
const loggedUsernameSpan = document.getElementById('logged-username');
const logoutBtn = document.getElementById('logout-btn');
const authTabs = document.getElementById('auth-tabs');

function mostrarUsuarioLogueado(username) {
  loginForm.style.display = 'none';
  registerForm.style.display = 'none';
  authTabs.style.display = 'none';
  userLoggedDiv.style.display = '';
  loggedUsernameSpan.textContent = username;
  localStorage.setItem('juge_user', username);
}

function cerrarSesion() {
  userLoggedDiv.style.display = 'none';
  loginForm.style.display = '';
  authTabs.style.display = '';
  showLoginBtn.classList.add('active');
  showRegisterBtn.classList.remove('active');
  localStorage.removeItem('juge_user');
}

logoutBtn.addEventListener('click', cerrarSesion);

// Al cargar la página, revisar si hay usuario logueado
window.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('juge_user');
  if (user) {
    mostrarUsuarioLogueado(user);
  }
});

// Modificar login para mostrar usuario logueado
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginMsg.textContent = '';
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      loginMsg.textContent = data.mensaje;
      loginMsg.classList.add('success');
      mostrarUsuarioLogueado(data.username);
    } else {
      loginMsg.textContent = data.error || 'Error al iniciar sesión.';
      loginMsg.classList.remove('success');
    }
  } catch (err) {
    loginMsg.textContent = 'No se pudo conectar al servidor.';
    loginMsg.classList.remove('success');
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  registerMsg.textContent = '';
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  try {
    const res = await fetch('http://localhost:3000/api/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      registerMsg.textContent = data.mensaje;
      registerMsg.classList.add('success');
      registerForm.reset();
    } else {
      registerMsg.textContent = data.error || 'Error al registrarse.';
      registerMsg.classList.remove('success');
    }
  } catch (err) {
    registerMsg.textContent = 'No se pudo conectar al servidor.';
    registerMsg.classList.remove('success');
  }
});

// Mostrar/ocultar versiones anteriores
function mostrarVersionesAnteriores() {
  const versionesExtra = document.querySelector('#versiones-anteriores .versiones-extra');
  const titulo = document.querySelector('#versiones-anteriores h2');
  if (versionesExtra.style.display === 'block') {
    versionesExtra.style.display = 'none';
    titulo.textContent = 'Versiones anteriores ▼';
  } else {
    versionesExtra.style.display = 'block';
    titulo.textContent = 'Versiones anteriores ▲';
  }
}

function mostrarAlertaVersionAntigua() {
  const confirmacion = confirm(
    "⚠️ ADVERTENCIA: Versión 2.0 BETA obsoleta\n\n" +
    "Esta es una versión beta antigua con funcionalidades limitadas.\n" +
    "Recomendamos descargar la versión más actual (JugeLauncher 2.0) para evitar problemas y disfrutar de todas las mejoras.\n\n" +
    "¿Aún deseas descargar esta versión beta?"
  );
  if (confirmacion) {
    window.location.href = 'https://drive.google.com/file/d/1Z59h_NUP_cTqMA6DBqzkNSQpIJkCuxYP/view?usp=sharing';
  }
}
