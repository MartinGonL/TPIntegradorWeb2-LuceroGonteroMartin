const express = require('express');
const router = express.Router();
const AsignacionCamaController = require('../controllers/asignacionCamaController');

// Mostrar formulario de asignación
router.get('/admision/:admisionId', AsignacionCamaController.mostrarFormularioAsignacion);

// Procesar la asignación
router.post('/admision/:admisionId/asignar-cama', AsignacionCamaController.asignarCama);

module.exports = router;
