
const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/pacienteController.js');

router.get('/', PacienteController.listarPacientes);             // Ruta para listar todos los pacientes
router.get('/nuevo', PacienteController.mostrarFormularioNuevo); // Ruta para mostrar el formulario de nuevo paciente
router.post('/', PacienteController.insertar);                   // Ruta para manejar el envío del formulario de nuevo paciente
router.get('/:id', PacienteController.verPaciente);              // Ruta para ver un paciente específico
router.get('/:id/edit', PacienteController.mostrarFormularioEditar); // Ruta para mostrar el formulario de edición de paciente
router.post('/:id/actualizar', PacienteController.actualizarPaciente); // Ruta para procesar la actualización del paciente
router.post('/:id/delete', PacienteController.eliminarPaciente);   // Ruta para procesar la eliminación del paciente
router.post('/:id/alta', PacienteController.darDeAltaPaciente); // Ruta para dar de alta a un paciente
module.exports = router;