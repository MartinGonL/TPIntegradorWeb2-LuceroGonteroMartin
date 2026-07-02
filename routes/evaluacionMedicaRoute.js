const express = require('express');
const router = express.Router();
const EvaluacionMedicaController = require('../controllers/evaluacionMedicaController');
const { permitirRoles } = require('../middlewares/authMiddleware');

// Redirigir la raíz a admisiones
router.get('/', (req, res) => res.redirect('/admisiones'));

// Mostrar formulario para nueva evaluación (Sólo Médico y Admin)
router.get('/admision/:admisionId/nueva', permitirRoles(['Admin', 'Medico']), EvaluacionMedicaController.mostrarFormularioNueva);

// Guardar nueva evaluación (Sólo Médico y Admin)
router.post('/admision/:admisionId', permitirRoles(['Admin', 'Medico']), EvaluacionMedicaController.guardar);

// Ver detalle de una evaluación (Admin, Medico, Enfermero)
router.get('/:id', permitirRoles(['Admin', 'Medico', 'Enfermero']), EvaluacionMedicaController.verDetalle);

// Mostrar formulario para editar (Sólo Médico y Admin)
router.get('/:id/editar', permitirRoles(['Admin', 'Medico']), EvaluacionMedicaController.mostrarFormularioEditar);
router.get('/:id/edit', permitirRoles(['Admin', 'Medico']), EvaluacionMedicaController.mostrarFormularioEditar);

// Procesar actualización (Sólo Médico y Admin)
router.post('/:id/actualizar', permitirRoles(['Admin', 'Medico']), EvaluacionMedicaController.actualizar);

module.exports = router;
