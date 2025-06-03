const express = require('express');

const router = express.Router();

const CamaController = require('../controllers/camaController.js');


router.get('/', CamaController.listarCamas);

router.get('/nueva', CamaController.mostrarFormularioCrear);

router.post('/', CamaController.crearCama);

router.get('/:id/edit', CamaController.mostrarFormularioEditar);

router.post('/:id/actualizar', CamaController.actualizarCama);

router.post('/:id/delete', CamaController.eliminarCama);

module.exports = router;
