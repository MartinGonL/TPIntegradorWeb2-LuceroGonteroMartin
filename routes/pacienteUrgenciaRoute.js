const express = require('express');
const router = express.Router();
const PacienteUrgenciaController = require('../controllers/pacienteUrgenciaController.js');

router.get('/', PacienteUrgenciaController.listarUrgencias);
router.get('/nuevo', PacienteUrgenciaController.mostrarFormularioNuevo);
router.post('/', PacienteUrgenciaController.insertarUrgencia);
router.post('/:id/eliminar', PacienteUrgenciaController.eliminarUrgencia);
router.get('/:id/actualizar', PacienteUrgenciaController.actualizarUrgencia);

module.exports = router;
