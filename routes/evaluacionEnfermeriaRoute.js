const express = require('express');
const router = express.Router();
const EvaluacionEnfermeriaController = require('../controllers/evaluacionEnfermeriaController');

// Redirigir la raíz a admisiones
router.get('/', (req, res) => res.redirect('/admisiones'));

// Mostrar formulario para nueva evaluación
router.get('/nueva/:admisionId', EvaluacionEnfermeriaController.mostrarFormularioNueva);

// Guardar nueva evaluación
router.post('/admision/:admisionId', EvaluacionEnfermeriaController.guardar);

// Ver detalle de una evaluación
router.get('/:id', EvaluacionEnfermeriaController.verDetalle);

// Mostrar formulario para editar
router.get('/:id/editar', EvaluacionEnfermeriaController.mostrarFormularioEditar);

// Procesar actualización
router.post('/:id/actualizar', EvaluacionEnfermeriaController.actualizar);

module.exports = router;
