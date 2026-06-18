const EvaluacionMedica = require('../models/evaluacionMedicaModel');
const Admision = require('../models/admisionModel');
const Paciente = require('../models/pacienteModel');

const EvaluacionMedicaController = {

    async mostrarFormularioNueva(req, res, next) {
        const { admisionId } = req.params;
        try {
            const admision = await Admision.buscarPorId(admisionId);
            const paciente = await Paciente.buscarPorId(admision.paciente_id);
            res.render('evaluacion_medica/nueva', {
                title: 'Nueva Evaluación Médica',
                admision,
                paciente
            });
        } catch (error) {
            next(error);
        }
    },

    async guardar(req, res, next) {
        const { admisionId } = req.params;
        const { observaciones } = req.body;
        try {
            await EvaluacionMedica.crear({ admision_id: admisionId, observaciones });
            res.redirect(`/admisiones/${admisionId}`);
        } catch (error) {
            next(error);
        }
    },

    async verDetalle(req, res, next) {
        const { id } = req.params;
        try {
            const evaluacion = await EvaluacionMedica.obtenerPorId(id);
            const admision = await Admision.buscarPorId(evaluacion.admision_id);
            const paciente = await Paciente.buscarPorId(admision.paciente_id);
            res.render('evaluacion_medica/detalle', {
                title: 'Detalle de Evaluación Médica',
                evaluacion,
                admision,
                paciente
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = EvaluacionMedicaController;
