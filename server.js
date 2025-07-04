const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Servir archivos estáticos

const DB_FILE = 'usuarios.json';

function leerUsuarios() {
  if (!fs.existsSync(DB_FILE)) return [];
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  try { return JSON.parse(data); } catch { return []; }
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync(DB_FILE, JSON.stringify(usuarios, null, 2));
}

app.post('/api/registro', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }
  let usuarios = leerUsuarios();
  if (usuarios.find(u => u.username === username)) {
    return res.status(409).json({ error: 'El nombre de usuario ya existe.' });
  }
  if (usuarios.find(u => u.email === email)) {
    return res.status(409).json({ error: 'El correo ya está registrado.' });
  }
  usuarios.push({ username, email, password });
  guardarUsuarios(usuarios);
  res.json({ mensaje: 'Registro exitoso.' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }
  let usuarios = leerUsuarios();
  const usuario = usuarios.find(u => u.email === email && u.password === password);
  if (!usuario) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
  }
  res.json({ mensaje: 'Inicio de sesión exitoso.', username: usuario.username });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
}); 