const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const pacienteRoutes = require('./routes/pacienteRoute'); // Requerir rutas de pacientes
const admisionRoutes = require('./routes/admisionRoute'); // Requerir rutas de admisiones
const alaRoutes = require('./routes/alaRoute');           // Requerir rutas de alas
const habitacionRoutes = require('./routes/habitacionRoute'); // Requerir rutas de habitaciones
const camaRoutes = require('./routes/camaRoute');             // Requerir rutas de camas
const asignacionCamaRoutes = require('./routes/asignacionCamaRoute.js'); // Requerir rutas de asignación de camas
const evaluacionEnfermeriaRoutes = require('./routes/evaluacionEnfermeriaRoute.js'); // Requerir rutas de evaluación de enfermería
const evaluacionMedicaRoutes = require('./routes/evaluacionMedicaRoute.js');     // Requerir rutas de evaluación médica

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', (req, res) => {
    res.render('index', { title: 'Inicio - SIH' });
});

app.get('/contacto', (req, res) => {
    res.render('contacto', { title: 'Contacto' });
});

app.use('/pacientes', pacienteRoutes);


app.use('/admisiones', admisionRoutes);


app.use('/alas', alaRoutes);


app.use('/habitaciones', habitacionRoutes);


app.use('/camas', camaRoutes);


app.use('/asignaciones-cama', asignacionCamaRoutes);


app.use('/evaluaciones-enfermeria', evaluacionEnfermeriaRoutes);


app.use('/evaluaciones-medicas', evaluacionMedicaRoutes);


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
