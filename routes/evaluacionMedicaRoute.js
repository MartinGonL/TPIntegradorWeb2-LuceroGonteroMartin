const express = require('express');
const router = express.Router();
const EvaluacionMedicaController = require('../controllers/evaluacionMedicaController');

// Redirigir la raíz a admisiones
router.get('/', (req, res) => res.redirect('/admisiones'));

// Mostrar formulario para nueva evaluación
router.get('/admision/:admisionId/nueva', EvaluacionMedicaController.mostrarFormularioNueva);

// Guardar nueva evaluación
router.post('/admision/:admisionId', EvaluacionMedicaController.guardar);

// Ver detalle de una evaluación
router.get('/:id', EvaluacionMedicaController.verDetalle);

// Mostrar formulario para editar (soportando tanto /editar como /edit)
router.get('/:id/editar', EvaluacionMedicaController.mostrarFormularioEditar);
router.get('/:id/edit', EvaluacionMedicaController.mostrarFormularioEditar);

// Procesar actualización
router.post('/:id/actualizar', EvaluacionMedicaController.actualizar);

module.exports = router;
