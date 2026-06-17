const Ala = require('../models/alaModel.js');

const AlaController = {
    async listarAlas(req, res, next) {
        try {
            const alas = await Ala.listarTodas();
            res.render('ala/lista', {
                title: 'Lista de Alas',
                alas: alas
            });
        } catch (error) {
            console.error('Error al listar alas:', error);
            next(error);
        }
    },

    mostrarFormularioNueva(req, res) {
        res.render('ala/nueva', { title: 'Registrar Nueva Ala' });
    },

    async insertar(req, res, next) {
        const { nombre, descripcion } = req.body;
        
        // Validación básica
        if (!nombre) {
            return res.status(400).render('ala/nueva', {
                title: 'Registrar Nueva Ala',
                error: 'El nombre del ala es obligatorio',
                ala: { nombre, descripcion }
            });
        }

        try {
            await Ala.crear({ nombre, descripcion });
            res.redirect('/alas');
        } catch (error) {
            console.error('Error al insertar ala:', error);
            res.status(500).render('ala/nueva', {
                title: 'Registrar Nueva Ala',
                error: 'Error al guardar el ala. Es posible que el nombre ya exista.',
                ala: { nombre, descripcion }
            });
        }
    },

    async mostrarFormularioEditar(req, res, next) {
        const { id } = req.params;
        try {
            const ala = await Ala.buscarPorId(id);
            if (!ala) {
                const err = new Error('Ala no encontrada');
                err.status = 404;
                return next(err);
            }
            res.render('ala/editar', {
                title: `Editar Ala: ${ala.nombre}`,
                ala: ala
            });
        } catch (error) {
            console.error('Error al buscar ala para editar:', error);
            next(error);
        }
    },

    async actualizar(req, res, next) {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        try {
            await Ala.actualizar(id, { nombre, descripcion });
            res.redirect('/alas');
        } catch (error) {
            console.error('Error al actualizar ala:', error);
            next(error);
        }
    },

    async eliminar(req, res, next) {
        const { id } = req.params;
        try {
            await Ala.eliminar(id);
            res.redirect('/alas');
        } catch (error) {
            console.error('Error al eliminar ala:', error);
            // Si hay habitaciones asociadas, el SQL tirará error por integridad referencial
            next(error);
        }
    }
};

module.exports = AlaController;
