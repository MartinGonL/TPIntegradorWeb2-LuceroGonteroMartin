const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

// Listado de usuarios
router.get('/', UsuarioController.listarUsuarios);

// Mostrar formulario de creación
router.get('/nuevo', UsuarioController.mostrarFormularioCrear);

// Procesar la creación de usuario
router.post('/nuevo', UsuarioController.crearUsuario);

// Mostrar formulario de edición
router.get('/:id/edit', UsuarioController.mostrarFormularioEditar);

// Procesar la actualización del usuario
router.post('/:id/edit', UsuarioController.actualizarUsuario);

// Procesar la eliminación de usuario
router.post('/:id/delete', UsuarioController.eliminarUsuario);

module.exports = router;
