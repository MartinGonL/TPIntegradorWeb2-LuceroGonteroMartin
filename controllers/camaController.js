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
        if (!codigo_cama || codigo_cama.trim() === '') {
            errores.push({ msg: 'El campo Código de Cama es obligatorio.' });
        }

        let codigoNormalizado = codigo_cama ? codigo_cama.trim() : '';

        if (datosCama.estado_cama && !ESTADOS_CAMA_VALIDOS.includes(datosCama.estado_cama)) {
            errores.push({ msg: 'El estado de la cama proporcionado no es válido.' });
        }

        if (habitacion_id && errores.length === 0) {
            try {
                const habitacion = await Habitacion.obtenerPorId(habitacion_id);
                if (!habitacion) {
                    errores.push({ msg: 'La habitación seleccionada no existe.' });
                } else {
                    const camasExistentes = await Cama.listarPorIdHabitacion(habitacion_id);
                    if (camasExistentes.length >= habitacion.capacidad) {
                        errores.push({ msg: `La habitación seleccionada ya cubrió su capacidad máxima de camas (${habitacion.capacidad}).` });
                    }

                    if (codigoNormalizado !== '' && errores.length === 0) {
                        const habitacionNombre = habitacion.numero_habitacion.toUpperCase(); // Ej: "N-101"
                        const codigoIngresado = codigoNormalizado.toUpperCase();             // Ej: "N-101A"

                        if (!codigoIngresado.startsWith(habitacionNombre)) {
                            errores.push({ msg: `El código de la cama debe comenzar con el número de la habitación seleccionada (${habitacion.numero_habitacion}). Ejemplo: ${habitacion.numero_habitacion}A` });
                        } else {
                            datosCama.codigo_cama = codigoNormalizado.toUpperCase();
                        }
                    }
                }
            } catch (errDb) {
                console.error('Error al validar habitación durante creación:', errDb);
                errores.push({ msg: 'Error al consultar datos de la habitación en la base de datos.' });
            }
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
            errores.push({ msg: 'Nombre ya existente.' });
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
        if (!codigo_cama || codigo_cama.trim() === '') {
            errores.push({ msg: 'El campo Código de Cama es obligatorio.' });
        }

        let codigoNormalizado = codigo_cama ? codigo_cama.trim() : '';

        if (codigoNormalizado !== '') {
            const regexCama = /^Cama-[NSns]-\d+(?:-[A-Za-z])?$/i;
            if (!regexCama.test(codigoNormalizado)) {
                errores.push({ msg: 'El Código de Cama debe tener un formato válido, ej. Cama-N-101-A o Cama-N-103.' });
            }
        }

        if (estado_cama && !ESTADOS_CAMA_VALIDOS.includes(estado_cama)) {
            errores.push({ msg: 'El estado de la cama proporcionado no es válido.' });
        }

        if (habitacion_id && errores.length === 0) {
            try {
                const habitacion = await Habitacion.obtenerPorId(habitacion_id);
                if (!habitacion) {
                    errores.push({ msg: 'La habitación seleccionada no existe.' });
                } else {
                    const camasExistentes = await Cama.listarPorIdHabitacion(habitacion_id);
                    const camasEnHabitacion = camasExistentes.filter(c => c.id !== parseInt(id));
                    if (camasEnHabitacion.length >= habitacion.capacidad) {
                        errores.push({ msg: `La habitación seleccionada ya cubrió su capacidad máxima de camas (${habitacion.capacidad}).` });
                    }

                    if (codigoNormalizado !== '' && errores.length === 0) {
                        const partes = codigoNormalizado.split('-');
                        const prefijo = 'Cama';
                        const alaInicial = partes[1].toUpperCase();
                        const habitacionNum = partes[2];
                        const letra = partes[3] ? `-${partes[3].toUpperCase()}` : '';

                        const habitacionCodigo = `${alaInicial}-${habitacionNum}`;

                        if (habitacionCodigo.toUpperCase() !== habitacion.numero_habitacion.toUpperCase()) {
                            errores.push({ msg: `El código de la cama (${codigoNormalizado}) debe corresponder a la habitación seleccionada (${habitacion.numero_habitacion}).` });
                        }

                        if (errores.length === 0) {
                            codigoNormalizado = `${prefijo}-${alaInicial}-${habitacionNum}${letra}`;
                            datosCamaForm.codigo_cama = codigoNormalizado;
                        }
                    }
                }
            } catch (errDb) {
                console.error('Error al validar habitación durante actualización:', errDb);
                errores.push({ msg: 'Error al consultar datos de la habitación en la base de datos.' });
            }
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
        
        const datosCamaActualizar = { habitacion_id, codigo_cama: datosCamaForm.codigo_cama || codigo_cama, estado_cama };
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
            errores.push({ msg: 'Nombre ya existente.' });
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