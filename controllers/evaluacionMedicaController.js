const EvaluacionMedica = require('../models/evaluacionMedicaModel');
const EvaluacionEnfermeria = require('../models/evaluacionEnfermeriaModel');
const Admision = require('../models/admisionModel');
const Paciente = require('../models/pacienteModel');
const Usuario = require('../models/usuarioModel');

const EvaluacionMedicaController = {

    async mostrarFormularioNueva(req, res, next) {
        const { admisionId } = req.params;
        try {
            const admision = await Admision.buscarPorId(admisionId);
            if (!admision) {
                const err = new Error('Admisión no encontrada.');
                err.status = 404;
                return next(err);
            }

            // Si ya existe una evaluación médica asignada a la admisión, redirigir a su detalle
            const evaluacionesExistentes = await EvaluacionMedica.listarPorAdmision(admisionId);
            if (evaluacionesExistentes && evaluacionesExistentes.length > 0) {
                return res.redirect(`/evaluaciones-medicas/${evaluacionesExistentes[0].id}`);
            }

            const paciente = await Paciente.buscarPorId(admision.paciente_id);
            const evaluacionEnfermeria = await EvaluacionEnfermeria.obtenerPorIdAdmision(admisionId);
            const medicos = await Usuario.listarPorRol('Medico');
 
            res.render('evaluacion_medica/nueva', {
                title: 'Nueva Evaluación Médica',
                admision,
                paciente,
                evaluacionEnfermeria,
                evaluacionMedica: {},
                medicos
            });
        } catch (error) {
            next(error);
        }
    },

    async guardar(req, res, next) {
        const { admisionId } = req.params;
        const datos = {
            admision_id: admisionId,
            medico_id: req.body.medico_id,
            evaluacion_enfermeria_id: req.body.evaluacion_enfermeria_id || null,
            diagnostico_principal: req.body.diagnostico_principal,
            diagnosticos_secundarios: req.body.diagnosticos_secundarios || null,
            plan_tratamiento_inicial: req.body.plan_tratamiento_inicial,
            tratamiento_farmacologico: req.body.tratamiento_farmacologico || null,
            tratamiento_no_farmacologico: req.body.tratamiento_no_farmacologico || null,
            procedimientos_medicos: req.body.procedimientos_medicos || null,
            interconsultas_solicitadas: req.body.interconsultas_solicitadas || null,
            solicitud_pruebas_diagnosticas: req.body.solicitud_pruebas_diagnosticas || null,
            observaciones_evolucion: req.body.observaciones_evolucion || null,
            recomendaciones_alta_seguimiento: req.body.recomendaciones_alta_seguimiento || null,
            notas_medicas_adicionales: req.body.notas_medicas_adicionales || null
        };

        if (datos.evaluacion_enfermeria_id === '') {
            datos.evaluacion_enfermeria_id = null;
        }

        try {
            await EvaluacionMedica.crear(datos);
            res.redirect(`/admisiones/${admisionId}`);
        } catch (error) {
            console.error('Error al guardar la evaluación médica:', error);
            try {
                const admision = await Admision.buscarPorId(admisionId);
                const paciente = await Paciente.buscarPorId(admision.paciente_id);
                const evaluacionEnfermeria = await EvaluacionEnfermeria.obtenerPorIdAdmision(admisionId);
                const medicos = await Usuario.listarPorRol('Medico');
                res.render('evaluacion_medica/nueva', {
                    title: 'Nueva Evaluación Médica',
                    admision,
                    paciente,
                    evaluacionEnfermeria,
                    evaluacionMedica: req.body,
                    medicos,
                    errors: [{ msg: 'Error al guardar la evaluación médica en la base de datos.' }]
                });
            } catch (innerError) {
                next(innerError);
            }
        }
    },

    async verDetalle(req, res, next) {
        const { id } = req.params;
        try {
            const evaluacion = await EvaluacionMedica.obtenerPorId(id);
            if (!evaluacion) {
                const err = new Error('Evaluación médica no encontrada.');
                err.status = 404;
                return next(err);
            }
            const admision = await Admision.buscarPorId(evaluacion.admision_id);
            const paciente = await Paciente.buscarPorId(admision.paciente_id);
            
            // Buscar evaluación de enfermería vinculada, ya sea por el ID guardado o por la admisión
            let evaluacionEnfermeria = null;
            if (evaluacion.evaluacion_enfermeria_id) {
                evaluacionEnfermeria = await EvaluacionEnfermeria.obtenerPorId(evaluacion.evaluacion_enfermeria_id);
            } else {
                evaluacionEnfermeria = await EvaluacionEnfermeria.obtenerPorIdAdmision(evaluacion.admision_id);
            }

            res.render('evaluacion_medica/detalle', {
                title: 'Detalle de Evaluación Médica',
                evaluacionMedica: evaluacion,
                admision,
                paciente,
                evaluacionEnfermeria
            });
        } catch (error) {
            next(error);
        }
    },

    async mostrarFormularioEditar(req, res, next) {
        const { id } = req.params;
        try {
            const evaluacion = await EvaluacionMedica.obtenerPorId(id);
            if (!evaluacion) {
                const err = new Error('Evaluación médica no encontrada.');
                err.status = 404;
                return next(err);
            }
            const admision = await Admision.buscarPorId(evaluacion.admision_id);
            const paciente = await Paciente.buscarPorId(admision.paciente_id);
            
            let evaluacionEnfermeria = null;
            if (evaluacion.evaluacion_enfermeria_id) {
                evaluacionEnfermeria = await EvaluacionEnfermeria.obtenerPorId(evaluacion.evaluacion_enfermeria_id);
            } else {
                evaluacionEnfermeria = await EvaluacionEnfermeria.obtenerPorIdAdmision(evaluacion.admision_id);
            }
            const medicos = await Usuario.listarPorRol('Medico');
 
            res.render('evaluacion_medica/editar', {
                title: 'Editar Evaluación Médica',
                evaluacionMedica: evaluacion,
                admision,
                paciente,
                evaluacionEnfermeria,
                medicos
            });
        } catch (error) {
            next(error);
        }
    },

    async actualizar(req, res, next) {
        const { id } = req.params;
        const datos = {
            medico_id: req.body.medico_id,
            evaluacion_enfermeria_id: req.body.evaluacion_enfermeria_id || null,
            diagnostico_principal: req.body.diagnostico_principal,
            diagnosticos_secundarios: req.body.diagnosticos_secundarios || null,
            plan_tratamiento_inicial: req.body.plan_tratamiento_inicial,
            tratamiento_farmacologico: req.body.tratamiento_farmacologico || null,
            tratamiento_no_farmacologico: req.body.tratamiento_no_farmacologico || null,
            procedimientos_medicos: req.body.procedimientos_medicos || null,
            interconsultas_solicitadas: req.body.interconsultas_solicitadas || null,
            solicitud_pruebas_diagnosticas: req.body.solicitud_pruebas_diagnosticas || null,
            observaciones_evolucion: req.body.observaciones_evolucion || null,
            recomendaciones_alta_seguimiento: req.body.recomendaciones_alta_seguimiento || null,
            notas_medicas_adicionales: req.body.notas_medicas_adicionales || null
        };

        if (datos.evaluacion_enfermeria_id === '') {
            datos.evaluacion_enfermeria_id = null;
        }

        try {
            const evaluacionOriginal = await EvaluacionMedica.obtenerPorId(id);
            if (!evaluacionOriginal) {
                const err = new Error('Evaluación médica no encontrada.');
                err.status = 404;
                return next(err);
            }
            await EvaluacionMedica.actualizar(id, datos);
            res.redirect(`/admisiones/${evaluacionOriginal.admision_id}`);
        } catch (error) {
            console.error('Error al actualizar la evaluación médica:', error);
            next(error);
        }
    }
};

module.exports = EvaluacionMedicaController;
