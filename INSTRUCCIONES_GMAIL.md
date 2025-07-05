# 🔧 Configuración de Gmail para Reportes de Bugs

## Para: luisdaniel200324@gmail.com

### Paso 1: Activar Verificación en Dos Pasos

1. Ve a [myaccount.google.com](https://myaccount.google.com/)
2. Inicia sesión con tu cuenta `luisdaniel200324@gmail.com`
3. Ve a **"Seguridad"** en el menú lateral
4. Busca **"Verificación en dos pasos"** y actívala si no está activada

### Paso 2: Generar Contraseña de Aplicación

1. En la misma sección de **"Seguridad"**
2. Busca **"Contraseñas de aplicación"**
3. Haz clic en **"Contraseñas de aplicación"**
4. Selecciona **"Correo"** como aplicación
5. Haz clic en **"Generar"**
6. **Copia la contraseña de 16 caracteres** que aparece

### Paso 3: Configurar el Sistema

1. Abre el archivo `config.js` en tu proyecto
2. Reemplaza `'TU_CONTRASEÑA_DE_APLICACION'` con la contraseña que copiaste
3. Guarda el archivo

### Ejemplo de configuración final:

```javascript
module.exports = {
  email: {
    user: 'luisdaniel200324@gmail.com',
    pass: 'abcd efgh ijkl mnop', // Tu contraseña de aplicación real
    service: 'gmail'
  }
};
```

### Paso 4: Probar el Sistema

1. Ejecuta el servidor: `npm start`
2. Abre `http://localhost:3000`
3. Ve a la sección **"Reportar Bug"**
4. Completa el formulario y envía un reporte de prueba
5. Verifica que recibas el correo de confirmación

## ⚠️ Notas Importantes

- **NUNCA uses tu contraseña normal de Gmail**
- **Solo usa la contraseña de aplicación de 16 caracteres**
- **La contraseña de aplicación es segura y específica para esta aplicación**
- **Si cambias tu contraseña de Gmail, necesitarás generar una nueva contraseña de aplicación**

## 🆘 Si tienes problemas

1. **Error "Invalid login"**: Verifica que la verificación en dos pasos esté activada
2. **Error "App password required"**: Asegúrate de usar la contraseña de aplicación, no tu contraseña normal
3. **No recibes correos**: Revisa la carpeta de spam

## 📧 Correos que recibirás

- **Reporte de bug**: Cuando alguien reporte un error
- **Confirmación**: Cuando envíes un reporte (para confirmar que llegó)

¡Listo! Una vez configurado, el sistema funcionará automáticamente. 