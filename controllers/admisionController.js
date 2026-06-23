const Paciente = require('../models/pacienteModel.js');
const Admision = require('../models/admisionModel.js'); 
const EvaluacionEnfermeria = require('../models/evaluacionEnfermeriaModel.js');
const EvaluacionMedica = require('../models/evaluacionMedicaModel.js'); 
const Usuario = require('../models/usuarioModel.js'); 

const ESTADOS_ADMISION_VALIDOS = ['Activa', 'Completada', 'Cancelada'];

const AdmisionController = {

    async mostrarFormularioAdmision(req, res, next) {
        const { paciente_id } = req.query; 
        if (!paciente_id) {
            const err = new Error('El ID del paciente es requerido para registrar una admisión.');
            err.status = 400;
            return next(err);
        }

        try {
            const paciente = await Paciente.buscarPorId(paciente_id);
            if (!paciente) {
                const err = new Error('Paciente no encontrado para el registro de admisión.');
                err.status = 404;
                return next(err);
            }
            const medicos = await Usuario.listarPorRol('Medico');
            res.render('admision/nueva', {
                title: `Nueva Admisión para ${paciente.nombre} ${paciente.apellido}`, 
                paciente: paciente,
                paciente_id: paciente.id,
                medicos: medicos
            });
        } catch (error) {
            console.error('Error al obtener datos para el formulario de admisión:', error);
            next(error); 
        }
    },


    async registrarAdmision(req, res, next) {
        const { paciente_id, tipo_admision, medico_referente, diagnostico_inicial } = req.body;
        const datosAdmision = { paciente_id, tipo_admision, medico_referente, diagnostico_inicial };

        try {
            const medicosBD = await Usuario.listarPorRol('Medico');
            const MEDICOS_VALIDOS = medicosBD.map(m => m.nombre_completo);

            // Tipos de admisión válidos (debe coincidir con el select del formulario)
            const TIPOS_ADMISION_VALIDOS = [
                "Programada",
                "Derivación Médica",
                "Emergencia"
            ];

            const errores = [];
            if (!paciente_id || isNaN(Number(paciente_id)) || Number(paciente_id) <= 0)
                errores.push({ msg: 'El ID del paciente es obligatorio y debe ser un número válido.' });

            if (!tipo_admision || !TIPOS_ADMISION_VALIDOS.includes(tipo_admision))
                errores.push({ msg: 'El campo Tipo de Admisión es obligatorio y debe ser válido.' });

            if (!medico_referente || !MEDICOS_VALIDOS.includes(medico_referente))
                errores.push({ msg: 'Seleccione un médico referente válido.' });

            if (!diagnostico_inicial || diagnostico_inicial.trim().length < 5)
                errores.push({ msg: 'El Diagnóstico Inicial es obligatorio y debe tener al menos 5 caracteres.' });

            if (errores.length > 0) {
                const paciente = await Paciente.buscarPorId(paciente_id);
                return res.status(400).render('admision/nueva', {
                    title: `Nueva Admisión para ${paciente ? paciente.nombre + ' ' + paciente.apellido : 'Paciente Desconocido'}`,
                    errors: errores,
                    paciente: paciente,
                    paciente_id: paciente_id,
                    datosAdmision: datosAdmision,
                    medicos: medicosBD
                });
            }

            const idNuevaAdmision = await Admision.crear(datosAdmision);
            res.redirect(`/admisiones/${idNuevaAdmision}`);
        } catch (error) {
            console.error('Error al registrar la admisión:', error);
            try {
                const paciente = await Paciente.buscarPorId(paciente_id);
                const medicosBD = await Usuario.listarPorRol('Medico');
                res.status(500).render('admision/nueva', {
                    title: `Nueva Admisión para ${paciente ? paciente.nombre + ' ' + paciente.apellido : 'Paciente Desconocido'}`,
                    errors: [{ msg: 'Error al registrar la admisión. Intente nuevamente.' }],
                    paciente: paciente,
                    paciente_id: paciente_id,
                    datosAdmision: datosAdmision,
                    medicos: medicosBD
                });
            } catch (errorAlObtener) {
                console.error('Error al obtener datos del paciente después de un error de creación de admisión:', errorAlObtener);
                next(errorAlObtener);
            }
        }
    },

    async verAdmision(req, res, next) {
        const { id } = req.params; 
        try {
            const admision = await Admision.buscarPorId(id);
            if (!admision) {
                const err = new Error('Admisión no encontrada.');
                err.status = 404;
                return next(err);
            }

            const paciente = await Paciente.buscarPorId(admision.paciente_id);
            const evaluacionEnfermeria = await EvaluacionEnfermeria.obtenerPorIdAdmision(admision.id); 
            const evaluacionesMedicas = await EvaluacionMedica.listarPorAdmision(admision.id); 

            res.render('admision/detalle', {
                title: `Detalles de Admisión para ${paciente ? paciente.nombre + ' ' + paciente.apellido : 'Paciente Desconocido'} (ID: ${admision.id})`,
                admision: admision,
                paciente: paciente || {}, 
                evaluacionEnfermeria: evaluacionEnfermeria, 
                evaluacionesMedicas: evaluacionesMedicas 
            });
        } catch (error) {
            console.error('Error al obtener detalles de admisión, evaluación de enfermería o evaluaciones médicas:', error);
            next(error);
        }
    },

    async listarAdmisiones(req, res, next) {
        try {
            const admisiones = await Admision.listarTodas();
            res.render('admision/lista', {
                title: 'Todas las Admisiones',
                admisiones: admisiones
            });
        } catch (error) {
            console.error('Error al obtener todas las admisiones:', error);
            next(error);
        }
    },

    async actualizarEstadoAdmision(req, res, next) {
        const { id } = req.params; 
        const { nuevo_estado } = req.body;

        if (!nuevo_estado || !ESTADOS_ADMISION_VALIDOS.includes(nuevo_estado)) {
            const err = new Error('Estado nuevo inválido o faltante.');
            err.status = 400;

            return next(err); 
        }

        try {
            const filasAfectadas = await Admision.actualizarEstado(id, nuevo_estado);
            if (filasAfectadas > 0) {
                res.redirect(`/admisiones/${id}`);
            } else {
                const err = new Error('Admisión no encontrada para actualizar estado.');
                err.status = 404;
                return next(err);
            }
        } catch (error) {
            console.error('Error al actualizar el estado de la admisión:', error);
            next(error);
        }
    }
};

module.exports = AdmisionController;
