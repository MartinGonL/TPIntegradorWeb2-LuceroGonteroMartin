const Cama = require('../models/camaModel.js');
const Habitacion = require('../models/habitacionModel.js');

const ESTADOS_CAMA_VALIDOS = ['Libre', 'Ocupada', 'Mantenimiento', 'Higienizada', 'Reservada'];

const CamaController = {

    async listarCamas(req, res, next) {
        try {
            const camas = await Cama.listarTodas(); 
            res.render('cama/lista', {
                title: 'Camas del Hospital',
                camas: camas
            });
        } catch (error) {
            console.error('Error al obtener las camas del hospital:', error);
            next(error);
        }
    },

    async mostrarFormularioCrear(req, res, next) {
        try {
            const habitaciones = await Habitacion.listarTodas(); 
            res.render('cama/nueva', {
                title: 'Crear Nueva Cama', 
                habitaciones: habitaciones,
                cama: {}, 
                estadosCama: ESTADOS_CAMA_VALIDOS 
            });
        } catch (error) {
            console.error('Error al obtener habitaciones para el formulario de nueva cama:', error);
            next(error);
        }
    },

    async crearCama(req, res, next) {
        const { habitacion_id, codigo_cama, estado_cama } = req.body;
        const datosCama = { habitacion_id, codigo_cama, estado_cama: estado_cama || 'Libre' };

        const errores = []; 
        if (!habitacion_id) errores.push({ msg: 'El campo Habitación es obligatorio.' });
        if (!codigo_cama || codigo_cama.trim() === '') errores.push({ msg: 'El campo Código de Cama es obligatorio.' });
        if (datosCama.estado_cama && !ESTADOS_CAMA_VALIDOS.includes(datosCama.estado_cama)) {
            errores.push({ msg: 'El estado de la cama proporcionado no es válido.' });
        }

        if (errores.length > 0) {
            try {
                const habitaciones = await Habitacion.listarTodas();
                return res.status(400).render('cama/nueva', {
                    title: 'Crear Nueva Cama',
                    errors: errores, 
                    habitaciones: habitaciones,
                    cama: datosCama, 
                    estadosCama: ESTADOS_CAMA_VALIDOS
                });
            } catch (errorAlObtener) { 
                console.error('Error al obtener habitaciones durante la falla de validación de creación de cama:', errorAlObtener);
                return next(errorAlObtener);
            }
        }

        try {
            await Cama.crear(datosCama);
            res.redirect('/camas'); 
        } catch (error) {
            console.error('Error al crear la cama:', error);
            errores.push({ msg: 'Error al crear la cama. El código de cama ya podría existir en la habitación seleccionada o ocurrió un error en la base de datos.' });
            try {
                const habitaciones = await Habitacion.listarTodas();
                res.status(500).render('cama/nueva', {
                    title: 'Crear Nueva Cama',
                    errors: errores,
                    habitaciones: habitaciones,
                    cama: datosCama,
                    estadosCama: ESTADOS_CAMA_VALIDOS
                });
            } catch (errorAlObtener) {
                console.error('Error al obtener habitaciones después de un error de BD en creación de cama:', errorAlObtener);
                next(errorAlObtener);
            }
        }
    },

    async mostrarFormularioEditar(req, res, next) {
        const { id } = req.params;
        try {
            const cama = await Cama.obtenerPorId(id);
            if (!cama) {
                const err = new Error('Cama no encontrada para editar.');
                err.status = 404;
                return next(err); 
            }
            const habitaciones = await Habitacion.listarTodas();
            res.render('cama/editar', {
                title: `Editar Cama: ${cama.codigo_cama}`,
                cama: cama,
                habitaciones: habitaciones,
                estadosCama: ESTADOS_CAMA_VALIDOS
            });
        } catch (error) {
            console.error('Error al obtener cama o habitaciones para editar:', error);
            next(error);
        }
    },

    async actualizarCama(req, res, next) {
        const { id } = req.params;
        const { habitacion_id, codigo_cama, estado_cama } = req.body;
        const datosCamaForm = { id, habitacion_id, codigo_cama, estado_cama };

        const errores = [];
        if (!habitacion_id) errores.push({ msg: 'El campo Habitación es obligatorio.' });
        if (!codigo_cama || codigo_cama.trim() === '') errores.push({ msg: 'El campo Código de Cama es obligatorio.' });
        if (estado_cama && !ESTADOS_CAMA_VALIDOS.includes(estado_cama)) {
            errores.push({ msg: 'El estado de la cama proporcionado no es válido.' });
        }
        
        if (errores.length > 0) {
            try {
                const habitaciones = await Habitacion.listarTodas();
                return res.status(400).render('cama/editar', {
                    title: 'Editar Cama',
                    errors: errores,
                    habitaciones: habitaciones,
                    cama: datosCamaForm, 
                    estadosCama: ESTADOS_CAMA_VALIDOS
                });
            } catch (errorAlObtener) {
                console.error('Error al obtener habitaciones durante la falla de validación de actualización de cama:', errorAlObtener);
                return next(errorAlObtener);
            }
        }
        
        const datosCamaActualizar = { habitacion_id, codigo_cama, estado_cama };
        try {
            const filasAfectadas = await Cama.actualizar(id, datosCamaActualizar); 
            if (filasAfectadas > 0) {
                res.redirect('/camas');
            } else {
                const err = new Error('Cama no encontrada o ningún dato modificado durante la actualización.');
                err.status = 404;
                return next(err);
            }
        } catch (error) {
            console.error('Error al actualizar la cama:', error);
            errores.push({ msg: 'Error al actualizar la cama. El código de cama ya podría existir en la habitación seleccionada o ocurrió un error en la base de datos.' });
            try {
                const habitaciones = await Habitacion.listarTodas();
                res.status(500).render('cama/editar', {
                    title: 'Editar Cama',
                    errors: errores,
                    habitaciones: habitaciones,
                    cama: datosCamaForm,
                    estadosCama: ESTADOS_CAMA_VALIDOS
                });
            } catch (errorAlObtener) {
                console.error('Error al obtener habitaciones después de un error de BD en actualización de cama:', errorAlObtener);
                next(errorAlObtener);
            }
        }
    },

    async eliminarCama(req, res, next) {
        const { id } = req.params;
        try {
            const filasAfectadas = await Cama.eliminar(id); 
            if (filasAfectadas > 0) {
                res.redirect('/camas');
            } else {
                const err = new Error('Cama no encontrada para eliminar.');
                err.status = 404;
                return next(err);
            }
        } catch (error) {
            console.error('Error al eliminar la cama:', error);
            next(error); 
        }
    }
};

module.exports = CamaController;