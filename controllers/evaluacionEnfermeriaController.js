const EvaluacionEnfermeria = require('../models/evaluacionEnfermeriaModel');
const EvaluacionMedica = require('../models/evaluacionMedicaModel');
const Admision = require('../models/admisionModel');
const Paciente = require('../models/pacienteModel');

const EvaluacionEnfermeriaController = {

    async mostrarFormularioNueva(req, res, next) {
        const { admisionId } = req.params;
        try {
            const admision = await Admision.buscarPorId(admisionId);
            if (!admision) {
                const err = new Error('Admisión no encontrada para la evaluación.');
                err.status = 404;
                return next(err);
            }

            // Si ya existe una evaluación de enfermería asignada a la admisión, redirigir a su detalle
            const evaluacionExistente = await EvaluacionEnfermeria.obtenerPorIdAdmision(admisionId);
            if (evaluacionExistente) {
                return res.redirect(`/evaluaciones-enfermeria/${evaluacionExistente.id}`);
            }

            const paciente = await Paciente.buscarPorId(admision.paciente_id);
            const evaluacionesMedicas = await EvaluacionMedica.listarPorAdmision(admisionId);
            const evaluacionMedica = evaluacionesMedicas.length > 0 ? evaluacionesMedicas[0] : null;
            
            res.render('evaluacion_enfermeria/nueva', {
                title: 'Nueva Evaluación de Enfermería',
                admision: admision,
                paciente: paciente,
                evaluacion: {},
                evaluacionMedica: evaluacionMedica
            });
        } catch (error) {
            console.error('Error al mostrar formulario de evaluación:', error);
            next(error);
        }
    },

    async guardar(req, res, next) {
        const { admisionId } = req.params;
        const datos = { 
            admision_id: admisionId,
            ...req.body 
        };

        // Limpieza de datos numéricos vacíos
        if (datos.signos_vitales_fc === '') datos.signos_vitales_fc = null;
        if (datos.signos_vitales_fr === '') datos.signos_vitales_fr = null;
        if (datos.signos_vitales_temp === '') datos.signos_vitales_temp = null;
        if (datos.signos_vitales_sato2 === '') datos.signos_vitales_sato2 = null;

        try {
            await EvaluacionEnfermeria.crear(datos);
            res.redirect(`/admisiones/${admisionId}`);
        } catch (error) {
            console.error('Error al guardar evaluación de enfermería:', error);
            // Si hay error, volver a mostrar el formulario con los datos ingresados
            try {
                const admision = await Admision.buscarPorId(admisionId);
                const paciente = await Paciente.buscarPorId(admision.paciente_id);
                const evaluacionesMedicas = await EvaluacionMedica.listarPorAdmision(admisionId);
                const evaluacionMedica = evaluacionesMedicas.length > 0 ? evaluacionesMedicas[0] : null;
                res.render('evaluacion_enfermeria/nueva', {
                    title: 'Nueva Evaluación de Enfermería',
                    admision: admision,
                    paciente: paciente,
                    evaluacion: req.body,
                    evaluacionMedica: evaluacionMedica,
                    errors: [{ msg: 'Error al guardar en la base de datos.' }]
                });
            } catch (innerError) {
                next(innerError);
            }
        }
    },

    async verDetalle(req, res, next) {
        const { id } = req.params;
        try {
            const evaluacion = await EvaluacionEnfermeria.obtenerPorId(id);
            if (!evaluacion) {
                const err = new Error('Evaluación no encontrada.');
                err.status = 404;
                return next(err);
            }
            const admision = await Admision.buscarPorId(evaluacion.admision_id);
            const paciente = await Paciente.buscarPorId(admision.paciente_id);
            const evaluacionesMedicas = await EvaluacionMedica.listarPorAdmision(admision.id);
            const evaluacionMedica = evaluacionesMedicas.length > 0 ? evaluacionesMedicas[0] : null;

            res.render('evaluacion_enfermeria/detalle', {
                title: 'Detalle de Evaluación de Enfermería',
                evaluacion: evaluacion,
                admision: admision,
                paciente: paciente,
                evaluacionMedica: evaluacionMedica
            });
        } catch (error) {
            console.error('Error al ver detalle de evaluación:', error);
            next(error);
        }
    },

    async mostrarFormularioEditar(req, res, next) {
        const { id } = req.params;
        try {
            const evaluacion = await EvaluacionEnfermeria.obtenerPorId(id);
            if (!evaluacion) {
                const err = new Error('Evaluación no encontrada.');
                err.status = 404;
                return next(err);
            }
            const admision = await Admision.buscarPorId(evaluacion.admision_id);
            const paciente = await Paciente.buscarPorId(admision.paciente_id);
            const evaluacionesMedicas = await EvaluacionMedica.listarPorAdmision(admision.id);
            const evaluacionMedica = evaluacionesMedicas.length > 0 ? evaluacionesMedicas[0] : null;

            res.render('evaluacion_enfermeria/editar', {
                title: 'Editar Evaluación de Enfermería',
                evaluacion: evaluacion,
                admision: admision,
                paciente: paciente,
                evaluacionMedica: evaluacionMedica
            });
        } catch (error) {
            console.error('Error al mostrar formulario de edición:', error);
            next(error);
        }
    },

    async actualizar(req, res, next) {
        const { id } = req.params;
        const datos = { ...req.body };

        // Limpieza de datos numéricos vacíos
        if (datos.signos_vitales_fc === '') datos.signos_vitales_fc = null;
        if (datos.signos_vitales_fr === '') datos.signos_vitales_fr = null;
        if (datos.signos_vitales_temp === '') datos.signos_vitales_temp = null;
        if (datos.signos_vitales_sato2 === '') datos.signos_vitales_sato2 = null;

        try {
            const evaluacionOriginal = await EvaluacionEnfermeria.obtenerPorId(id);
            await EvaluacionEnfermeria.actualizar(id, datos);
            res.redirect(`/admisiones/${evaluacionOriginal.admision_id}`);
        } catch (error) {
            console.error('Error al actualizar evaluación de enfermería:', error);
            next(error);
        }
    }
};

module.exports = EvaluacionEnfermeriaController;
