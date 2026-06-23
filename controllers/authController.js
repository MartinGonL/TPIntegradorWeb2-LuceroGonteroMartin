const Usuario = require('../models/usuarioModel');
const crypto = require('crypto');

const AuthController = {

    mostrarLogin(req, res) {
        res.render('auth/login', { title: 'Iniciar Sesión' });
    },

    async login(req, res) {
        const { nombre_usuario, password } = req.body;
        const errores = [];

        if (!nombre_usuario) {
            errores.push({ msg: 'Debe ingresar el nombre de usuario.' });
        }
        if (!password) {
            errores.push({ msg: 'Debe ingresar la contraseña.' });
        }

        if (errores.length > 0) {
            return res.status(400).render('auth/login', {
                title: 'Iniciar Sesión',
                errors: errores,
                nombre_usuario
            });
        }

        try {
            const usuario = await Usuario.buscarPorNombreUsuario(nombre_usuario);
            
            // Hashear la contraseña ingresada usando SHA-256 nativo
            const passwordHasheado = crypto.createHash('sha256').update(password).digest('hex');
            
            if (!usuario || usuario.password !== passwordHasheado) {
                return res.status(400).render('auth/login', {
                    title: 'Iniciar Sesión',
                    errors: [{ msg: 'Usuario o contraseña incorrectos.' }],
                    nombre_usuario
                });
            }

            req.session.usuario = {
                id: usuario.id,
                nombre_usuario: usuario.nombre_usuario,
                rol: usuario.rol,
                nombre_completo: usuario.nombre_completo
            };

            res.redirect('/');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).render('auth/login', {
                title: 'Iniciar Sesión',
                errors: [{ msg: 'Error del servidor al intentar iniciar sesión.' }],
                nombre_usuario
            });
        }
    },

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
            }
            res.redirect('/auth/login');
        });
    }

};

module.exports = AuthController;
