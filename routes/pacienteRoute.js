const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// Ruta para mostrar el formulario de registro de un nuevo paciente
router.get('/nuevo', pacienteController.mostrarFormularioNuevo);

// Ruta para insertar un nuevo paciente
router.post('/nuevo', pacienteController.insertar);

// Ruta para actualizar un paciente (ejemplo)
router.put('/:id', pacienteController.actualizar);

// Ruta para eliminar un paciente (ejemplo)
router.delete('/:id', pacienteController.eliminar);

module.exports = router;