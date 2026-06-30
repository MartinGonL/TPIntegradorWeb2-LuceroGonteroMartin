const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const authRoute = require('./routes/authRoute'); // Requerir rutas de autenticación
const pacienteRoutes = require('./routes/pacienteRoute'); // Requerir rutas de pacientes
const admisionRoutes = require('./routes/admisionRoute'); // Requerir rutas de admisiones
const alaRoutes = require('./routes/alaRoute');           // Requerir rutas de alas
const habitacionRoutes = require('./routes/habitacionRoute'); // Requerir rutas de habitaciones
const camaRoutes = require('./routes/camaRoute');             // Requerir rutas de camas
const asignacionCamaRoutes = require('./routes/asignacionCamaRoute.js'); // Requerir rutas de asignación de camas
const evaluacionEnfermeriaRoutes = require('./routes/evaluacionEnfermeriaRoute.js'); // Requerir rutas de evaluación de enfermería
const evaluacionMedicaRoutes = require('./routes/evaluacionMedicaRoute.js');     // Requerir rutas de evaluación médica
const usuarioRoutes = require('./routes/usuarioRoute');             // Requerir rutas de gestión de usuarios
const pacienteUrgenciaRoutes = require('./routes/pacienteUrgenciaRoute'); // Requerir rutas de pacientes de urgencia
const { requerirLogin, permitirRoles } = require('./middlewares/authMiddleware'); // Requerir middlewares de protección

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(express.static(path.join(__dirname, 'public'))); 

// Configurar el uso de sesiones
app.use(session({
    secret: 'secreto_clinica',
    resave: false,
    saveUninitialized: false
}));

// Middleware para pasar los datos de la sesión a las vistas Pug
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;
    next();
});

// Rutas de autenticación (públicas)
app.use('/auth', authRoute);

// Proteger todas las rutas siguientes con login obligatorio
app.use(requerirLogin);

app.get('/', (req, res) => {
    res.render('index', { title: 'Inicio - SIH' });
});

app.get('/contacto', (req, res) => {
    res.render('contacto', { title: 'Contacto' });
});

// Rutas protegidas según los roles de usuario
app.use('/pacientes', permitirRoles(['Admin', 'Medico', 'Enfermero']), pacienteRoutes);
app.use('/admisiones', permitirRoles(['Admin', 'Medico', 'Enfermero']), admisionRoutes);
app.use('/alas', permitirRoles(['Admin']), alaRoutes);
app.use('/habitaciones', permitirRoles(['Admin']), habitacionRoutes);
app.use('/camas', permitirRoles(['Admin']), camaRoutes);
app.use('/asignaciones-cama', permitirRoles(['Admin']), asignacionCamaRoutes);
app.use('/usuarios', permitirRoles(['Admin']), usuarioRoutes);
app.use('/evaluaciones-enfermeria', permitirRoles(['Admin', 'Enfermero']), evaluacionEnfermeriaRoutes);
app.use('/evaluaciones-medicas', permitirRoles(['Admin', 'Medico']), evaluacionMedicaRoutes);
app.use('/pacientes-urgencia', permitirRoles(['Admin', 'Medico', 'Enfermero']), pacienteUrgenciaRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Página No Encontrada' }); 
});

app.use((err, req, res, next) => {
    console.error(err.stack); 
    const statusCode = err.status || 500;
    res.status(statusCode).render('500', {
        title: 'Error del Servidor', 
        message: err.message, 
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`); 
});
