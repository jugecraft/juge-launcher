const fs = require('fs');

const serverContent = `const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const config = require('./config');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes y videos'));
    }
  }
});

const transporter = nodemailer.createTransporter({
  service: config.email.service,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

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

app.post('/api/reportar-bug', upload.array('archivos', 3), async (req, res) => {
  try {
    const { nombre, email, version, descripcion } = req.body;
    const archivos = req.files || [];

    if (!nombre || !email || !version || !descripcion) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben estar completos.' });
    }

    const mailOptions = {
      from: 'luisdaniel200324@gmail.com',
      to: 'luisdaniel200324@gmail.com',
      subject: \`[BUG REPORT] \${nombre} reportó un error en JugeLauncher \${version}\`,
      html: \`<h2>Nuevo Reporte de Bug</h2>
             <p><strong>Usuario:</strong> \${nombre}</p>
             <p><strong>Correo:</strong> \${email}</p>
             <p><strong>Versión:</strong> \${version}</p>
             <p><strong>Descripción:</strong></p>
             <p>\${descripcion.replace(/\\n/g, '<br>')}</p>
             \${archivos.length > 0 ? \`<p><strong>Archivos adjuntos:</strong> \${archivos.length} archivo(s)</p>\` : ''}
             <hr>
             <p><em>Reporte enviado desde JugeLauncher Web</em></p>\`,
      attachments: archivos.map(archivo => ({
        filename: archivo.originalname,
        path: archivo.path
      }))
    };

    await transporter.sendMail(mailOptions);

    const confirmacionOptions = {
      from: 'luisdaniel200324@gmail.com',
      to: email,
      subject: 'Reporte de Bug Recibido - JugeLauncher',
      html: \`<h2>¡Gracias por tu reporte!</h2>
             <p>Hola \${nombre},</p>
             <p>Hemos recibido tu reporte de bug para JugeLauncher \${version}.</p>
             <p><strong>Tu descripción:</strong></p>
             <p>\${descripcion.replace(/\\n/g, '<br>')}</p>
             <p>Estamos revisando el problema y te contactaremos si necesitamos más información.</p>
             <p>¡Gracias por ayudarnos a mejorar JugeLauncher!</p>
             <hr>
             <p><em>Equipo de JugeLauncher</em></p>\`
    };

    await transporter.sendMail(confirmacionOptions);

    res.json({ mensaje: 'Reporte enviado exitosamente. Te hemos enviado un correo de confirmación.' });

  } catch (error) {
    console.error('Error al enviar reporte:', error);
    res.status(500).json({ error: 'Error al enviar el reporte. Inténtalo de nuevo.' });
  }
});

app.listen(PORT, () => {
  console.log('Servidor escuchando en http://localhost:' + PORT);
});`;

fs.writeFileSync('server.js', serverContent);
console.log('Archivo server.js creado exitosamente'); 