const express = require('express');
const router = express.Router();
const AlaController = require('../controllers/alaController');

// Listar todas las alas
router.get('/', AlaController.listarAlas);

// Formulario de nueva ala
router.get('/nueva', AlaController.mostrarFormularioNueva);

// Procesar nueva ala
router.post('/', AlaController.insertar);

// Formulario de edición
router.get('/:id/edit', AlaController.mostrarFormularioEditar);

// Procesar actualización
router.post('/:id/actualizar', AlaController.actualizar);

// Procesar eliminación
router.post('/:id/delete', AlaController.eliminar);

module.exports = router;
