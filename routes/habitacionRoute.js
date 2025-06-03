const express = require('express');

const router = express.Router();

const HabitacionController = require('../controllers/habitacionController.js');

router.get('/', HabitacionController.listarHabitaciones);

router.get('/nueva', HabitacionController.mostrarFormularioCrear);

router.post('/', HabitacionController.crearHabitacion);

router.get('/:id/edit', HabitacionController.mostrarFormularioEditar);

router.post('/:id/actualizar', HabitacionController.actualizarHabitacion);

router.post('/:id/delete', HabitacionController.eliminarHabitacion);

module.exports = router;
