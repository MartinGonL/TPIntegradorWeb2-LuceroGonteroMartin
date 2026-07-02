const express = require('express');
const router = express.Router();
const EvaluacionEnfermeriaController = require('../controllers/evaluacionEnfermeriaController');
const { permitirRoles } = require('../middlewares/authMiddleware');

// Redirigir la raíz a admisiones
router.get('/', (req, res) => res.redirect('/admisiones'));

// Mostrar formulario para nueva evaluación (Sólo Enfermero y Admin)
router.get('/admision/:admisionId/nueva', permitirRoles(['Admin', 'Enfermero']), EvaluacionEnfermeriaController.mostrarFormularioNueva);

// Guardar nueva evaluación (Sólo Enfermero y Admin)
router.post('/admision/:admisionId', permitirRoles(['Admin', 'Enfermero']), EvaluacionEnfermeriaController.guardar);

// Ver detalle de una evaluación (Admin, Enfermero, Medico)
router.get('/:id', permitirRoles(['Admin', 'Enfermero', 'Medico']), EvaluacionEnfermeriaController.verDetalle);

// Mostrar formulario para editar (Sólo Enfermero y Admin)
router.get('/:id/editar', permitirRoles(['Admin', 'Enfermero']), EvaluacionEnfermeriaController.mostrarFormularioEditar);
router.get('/:id/edit', permitirRoles(['Admin', 'Enfermero']), EvaluacionEnfermeriaController.mostrarFormularioEditar);

// Procesar actualización (Sólo Enfermero y Admin)
router.post('/:id/actualizar', permitirRoles(['Admin', 'Enfermero']), EvaluacionEnfermeriaController.actualizar);

module.exports = router;
