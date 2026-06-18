const express = require('express');
const router = express.Router();
const EvaluacionMedicaController = require('../controllers/evaluacionMedicaController');

router.get('/nueva/:admisionId', EvaluacionMedicaController.mostrarFormularioNueva);
router.post('/admision/:admisionId', EvaluacionMedicaController.guardar);
router.get('/:id', EvaluacionMedicaController.verDetalle);

module.exports = router;
