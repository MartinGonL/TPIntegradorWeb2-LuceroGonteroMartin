const express = require('express');

const router = express.Router();

const AdmisionController = require('../controllers/admisionController.js');

router.get('/nueva', AdmisionController.mostrarFormularioAdmision);

router.post('/', AdmisionController.registrarAdmision);

router.get('/', AdmisionController.listarAdmisiones);

router.get('/:id', AdmisionController.verAdmision);

router.post('/:id/actualizar-estado', AdmisionController.actualizarEstadoAdmision);

module.exports = router;
