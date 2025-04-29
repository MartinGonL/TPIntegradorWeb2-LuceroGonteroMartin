const express = require('express');
const path = require('path'); // Importar path para manejar rutas
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para procesar datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Importar el controlador de pacientes
const pacienteController = require('./controllers/pacienteController');

// Ruta para mostrar el formulario
app.get('/paciente/nuevo', pacienteController.mostrarFormularioNuevo);

// Ruta para insertar un nuevo paciente
app.post('/paciente/nuevo', pacienteController.insertar);

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});