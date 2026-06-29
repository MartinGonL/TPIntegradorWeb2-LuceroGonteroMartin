const Usuario = require('../models/usuarioModel');
const crypto = require('crypto');

const ROLES_VALIDOS = ['Admin', 'Medico', 'Enfermero'];

const UsuarioController = {

    async listarUsuarios(req, res, next) {
        try {
            const usuarios = await Usuario.listarTodos();
            res.render('usuario/lista', {
                title: 'Gestión de Usuarios',
                usuarios: usuarios
            });
        } catch (error) {
            console.error('Error al listar usuarios:', error);
            next(error);
        }
    },

    mostrarFormularioCrear(req, res) {
        res.render('usuario/nuevo', {
            title: 'Crear Nuevo Usuario',
            roles: ROLES_VALIDOS,
            datosUsuario: {}
        });
    },

    async crearUsuario(req, res, next) {
        const { nombre_usuario, password, rol, nombre_completo } = req.body;
        const datosUsuario = { nombre_usuario, rol, nombre_completo };

        const errores = [];

        if (!nombre_usuario || nombre_usuario.trim() === '') {
            errores.push({ msg: 'El nombre de usuario es obligatorio.' });
        } else if (nombre_usuario.length < 3) {
            errores.push({ msg: 'El nombre de usuario debe tener al menos 3 caracteres.' });
        }

        if (!password || password.trim() === '') {
            errores.push({ msg: 'La contraseña es obligatoria.' });
        } else if (password.length < 4) {
            errores.push({ msg: 'La contraseña debe tener al menos 4 caracteres.' });
        }

        if (!rol || !ROLES_VALIDOS.includes(rol)) {
            errores.push({ msg: 'Debe seleccionar un rol válido.' });
        }

        if (!nombre_completo || nombre_completo.trim() === '') {
            errores.push({ msg: 'El nombre completo es obligatorio.' });
        }

        try {
            // Verificar si el nombre de usuario ya está tomado
            if (nombre_usuario && nombre_usuario.trim() !== '') {
                const usuarioExistente = await Usuario.buscarPorNombreUsuario(nombre_usuario.trim());
                if (usuarioExistente) {
                    errores.push({ msg: 'El nombre de usuario ya está en uso por otro usuario.' });
                }
            }

            if (errores.length > 0) {
                return res.status(400).render('usuario/nuevo', {
                    title: 'Crear Nuevo Usuario',
                    errors: errores,
                    roles: ROLES_VALIDOS,
                    datosUsuario: datosUsuario
                });
            }

            // Hashear la contraseña usando SHA-256 nativo
            const passwordHasheado = crypto.createHash('sha256').update(password).digest('hex');

            await Usuario.crear({
                nombre_usuario: nombre_usuario.trim(),
                password: passwordHasheado,
                rol: rol,
                nombre_completo: nombre_completo.trim()
            });

            res.redirect('/usuarios');
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).render('usuario/nuevo', {
                title: 'Crear Nuevo Usuario',
                errors: [{ msg: 'Error del servidor al intentar registrar el usuario.' }],
                roles: ROLES_VALIDOS,
                datosUsuario: datosUsuario
            });
        }
    },

    async mostrarFormularioEditar(req, res, next) {
        const { id } = req.params;
        try {
            const usuario = await Usuario.buscarPorId(id);
            if (!usuario) {
                const err = new Error('Usuario no encontrado.');
                err.status = 404;
                return next(err);
            }
            res.render('usuario/editar', {
                title: `Editar Usuario: ${usuario.nombre_usuario}`,
                roles: ROLES_VALIDOS,
                usuario: usuario
            });
        } catch (error) {
            console.error('Error al obtener usuario para editar:', error);
            next(error);
        }
    },

    async actualizarUsuario(req, res, next) {
        const { id } = req.params;
        const { nombre_usuario, password, rol, nombre_completo } = req.body;
        const datosUsuarioForm = { id, nombre_usuario, rol, nombre_completo };

        const errores = [];

        if (!nombre_usuario || nombre_usuario.trim() === '') {
            errores.push({ msg: 'El nombre de usuario es obligatorio.' });
        } else if (nombre_usuario.length < 3) {
            errores.push({ msg: 'El nombre de usuario debe tener al menos 3 caracteres.' });
        }

        if (password && password.trim() !== '' && password.length < 4) {
            errores.push({ msg: 'La contraseña debe tener al menos 4 caracteres si la va a cambiar.' });
        }

        if (!rol || !ROLES_VALIDOS.includes(rol)) {
            errores.push({ msg: 'Debe seleccionar un rol válido.' });
        }

        if (!nombre_completo || nombre_completo.trim() === '') {
            errores.push({ msg: 'El nombre completo es obligatorio.' });
        }

        try {
            // Verificar si el nombre de usuario ya está tomado por otro usuario
            if (nombre_usuario && nombre_usuario.trim() !== '') {
                const usuarioExistente = await Usuario.buscarPorNombreUsuario(nombre_usuario.trim());
                if (usuarioExistente && usuarioExistente.id != id) {
                    errores.push({ msg: 'El nombre de usuario ya está en uso por otro usuario.' });
                }
            }

            if (errores.length > 0) {
                return res.status(400).render('usuario/editar', {
                    title: 'Editar Usuario',
                    errors: errores,
                    roles: ROLES_VALIDOS,
                    usuario: datosUsuarioForm
                });
            }

            const datosActualizar = {
                nombre_usuario: nombre_usuario.trim(),
                rol: rol,
                nombre_completo: nombre_completo.trim()
            };

            // Solo actualizar la contraseña si fue proporcionada
            if (password && password.trim() !== '') {
                const passwordHasheado = crypto.createHash('sha256').update(password).digest('hex');
                datosActualizar.password = passwordHasheado;
            }

            const filasAfectadas = await Usuario.actualizar(id, datosActualizar);
            if (filasAfectadas > 0) {
                res.redirect('/usuarios');
            } else {
                // Si ningún dato cambió, también redirigimos
                res.redirect('/usuarios');
            }
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).render('usuario/editar', {
                title: 'Editar Usuario',
                errors: [{ msg: 'Error del servidor al intentar actualizar el usuario.' }],
                roles: ROLES_VALIDOS,
                usuario: datosUsuarioForm
            });
        }
    },

    async eliminarUsuario(req, res, next) {
        const { id } = req.params;
        try {
            // Evitar que el administrador se elimine a sí mismo
            if (req.session && req.session.usuario && req.session.usuario.id == id) {
                const usuarios = await Usuario.listarTodos();
                return res.status(400).render('usuario/lista', {
                    title: 'Gestión de Usuarios',
                    usuarios: usuarios,
                    errors: [{ msg: 'No puedes eliminar a tu propio usuario con el que has iniciado sesión.' }]
                });
            }

            const filasAfectadas = await Usuario.eliminar(id);
            if (filasAfectadas > 0) {
                res.redirect('/usuarios');
            } else {
                const err = new Error('Usuario no encontrado para eliminar.');
                err.status = 404;
                return next(err);
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            next(error);
        }
    }

};

module.exports = UsuarioController;
