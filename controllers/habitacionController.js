const Habitacion = require('../models/habitacionModel.js'); 
const Ala = require('../models/alaModel.js'); 

const HabitacionController = {

    async listarHabitaciones(req, res, next) {
        try {
            const habitaciones = await Habitacion.listarTodas();
            res.render('habitacion/lista', {
                title: 'Habitaciones del Hospital',
                habitaciones: habitaciones
            });
        } catch (error) {
            console.error('Error al obtener las habitaciones del hospital:', error);
            next(error); 
        }
    },

    async mostrarFormularioCrear(req, res, next) {
        try {
            const alas = await Ala.listarTodas();
            res.render('habitacion/nueva', {
                title: 'Crear Nueva Habitación', 
                alas: alas,
                habitacion: {} 
            });
        } catch (error) {
            console.error('Error al obtener las alas para el formulario de nueva habitación:', error);
            next(error);
        }
    },

    async crearHabitacion(req, res, next) {
        const { ala_id, numero_habitacion, tipo, capacidad, descripcion } = req.body;
        const datosHabitacion = { ala_id, numero_habitacion, tipo, capacidad, descripcion };

        const errores = [];
        if (!ala_id) errores.push({ msg: 'El campo Ala es obligatorio.' });
        if (!numero_habitacion || numero_habitacion.trim() === '') errores.push({ msg: 'El campo Número de Habitación es obligatorio.' });
        if (!tipo || tipo.trim() === '') errores.push({ msg: 'El campo Tipo de Habitación es obligatorio.' });
        if (!capacidad || isNaN(parseInt(capacidad)) || parseInt(capacidad) <= 0) {
            errores.push({ msg: 'El campo Capacidad debe ser un número entero positivo.' });
        }

        if (errores.length > 0) {
            try {
                const alas = await Ala.listarTodas();
                return res.status(400).render('habitacion/nueva', {
                    title: 'Crear Nueva Habitación',
                    errors: errores,
                    alas: alas,
                    habitacion: datosHabitacion 
                });
            } catch (errorAlObtener) { 
                console.error('Error al obtener las alas durante la falla de validación de creación de habitación:', errorAlObtener);
                return next(errorAlObtener);
            }
        }

        try {
            await Habitacion.crear(datosHabitacion);
            res.redirect('/habitaciones'); 
        } catch (error) {
            console.error('Error al crear la habitación:', error);
            errores.push({ msg: 'Error al crear la habitación. El número de habitación ya podría existir en el ala seleccionada o ocurrió un error en la base de datos.' });
            try {
                const alas = await Ala.listarTodas();
                res.status(500).render('habitacion/nueva', {
                    title: 'Crear Nueva Habitación',
                    errors: errores,
                    alas: alas,
                    habitacion: datosHabitacion
                });
            } catch (errorAlObtener) {
                console.error('Error al obtener las alas después de un error de BD en creación de habitación:', errorAlObtener);
                next(errorAlObtener);
            }
        }
    },

    async mostrarFormularioEditar(req, res, next) {
        const { id } = req.params;
        try {
            const habitacion = await Habitacion.obtenerPorId(id);
            if (!habitacion) {
                const err = new Error('Habitación no encontrada para editar.');
                err.status = 404;
                return next(err); 
            }
            const alas = await Ala.listarTodas();
            res.render('habitacion/editar', {
                title: `Editar Habitación: ${habitacion.numero_habitacion}`,
                habitacion: habitacion,
                alas: alas
            });
        } catch (error) {
            console.error('Error al obtener habitación o alas para editar:', error);
            next(error);
        }
    },

    async actualizarHabitacion(req, res, next) {
        const { id } = req.params;
        const { ala_id, numero_habitacion, tipo, capacidad, descripcion } = req.body;
        const datosHabitacionForm = { id, ala_id, numero_habitacion, tipo, capacidad, descripcion };

        const errores = [];
        if (!ala_id) errores.push({ msg: 'El campo Ala es obligatorio.' });
        if (!numero_habitacion || numero_habitacion.trim() === '') errores.push({ msg: 'El campo Número de Habitación es obligatorio.' });
        if (!tipo || tipo.trim() === '') errores.push({ msg: 'El campo Tipo de Habitación es obligatorio.' });
        if (!capacidad || isNaN(parseInt(capacidad)) || parseInt(capacidad) <= 0) {
            errores.push({ msg: 'El campo Capacidad debe ser un número entero positivo.' });
        }

        if (errores.length > 0) {
            try {
                const alas = await Ala.listarTodas();
                return res.status(400).render('habitacion/editar', {
                    title: 'Editar Habitación',
                    errors: errores,
                    alas: alas,
                    habitacion: datosHabitacionForm 
                });
            } catch (errorAlObtener) {
                console.error('Error al obtener las alas durante la falla de validación de actualización de habitación:', errorAlObtener);
                return next(errorAlObtener);
            }
        }
        
        const datosHabitacionActualizar = { ala_id, numero_habitacion, tipo, capacidad, descripcion }; 
        try {            
            const filasAfectadas = await Habitacion.actualizar(id, datosHabitacionActualizar); 
            if (filasAfectadas > 0) {
                res.redirect('/habitaciones');
            } else {
                const err = new Error('Habitación no encontrada o ningún dato modificado durante la actualización.');
                err.status = 404;
                return next(err);
            }
        } catch (error) {
            console.error('Error al actualizar la habitación:', error);
            errores.push({ msg: 'Error al actualizar la habitación. El número de habitación ya podría existir en el ala seleccionada o ocurrió un error en la base de datos.' });
            try {
                const alas = await Ala.listarTodas();
                res.status(500).render('habitacion/editar', {
                    title: 'Editar Habitación',
                    errors: errores,
                    alas: alas,
                    habitacion: datosHabitacionForm
                });
            } catch (errorAlObtener) {
                console.error('Error al obtener las alas después de un error de BD en actualización de habitación:', errorAlObtener);
                next(errorAlObtener);
            }
        }
    },

    async eliminarHabitacion(req, res, next) {
        const { id } = req.params;
        try {
            const filasAfectadas = await Habitacion.eliminar(id); 
            if (filasAfectadas > 0) {
                res.redirect('/habitaciones');
            } else {
                const err = new Error('Habitación no encontrada para eliminar.');
                err.status = 404;
                return next(err);
            }
        } catch (error) {
            console.error('Error al eliminar la habitación:', error);

            next(error); 
        }
    }
};

module.exports = HabitacionController;