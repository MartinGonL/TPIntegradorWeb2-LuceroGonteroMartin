const express = require('express');
const router = express.Router();
const AsignacionCamaController = require('../controllers/asignacionCamaController');

// Redirigir la raíz a admisiones
router.get('/', (req, res) => res.redirect('/admisiones'));

// Mostrar formulario de asignación (soporta ambas rutas: la que estaba definida y la que se usa en las plantillas)
router.get('/admision/:admisionId', AsignacionCamaController.mostrarFormularioAsignacion);
router.get('/admision/:admisionId/asignar-cama/ui', AsignacionCamaController.mostrarFormularioAsignacion);

// Procesar la asignación
router.post('/admision/:admisionId/asignar-cama', AsignacionCamaController.asignarCama);

// Procesar liberación de cama
router.post('/admision/:admisionId/liberar-cama', AsignacionCamaController.liberarCama);

module.exports = router;
