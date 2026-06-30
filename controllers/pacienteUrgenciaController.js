const PacienteUrgencia = require('../models/pacienteUrgenciaModel.js');

const PacienteUrgenciaController = {

    async listarUrgencias(req, res, next) {
        try {
            const urgencias = await PacienteUrgencia.listarTodos();
            res.render('pacienteUrgencia/lista', {
                title: 'Pacientes de Urgencia',
                urgencias: urgencias
            });
        } catch (error) {
            console.error('Error al listar pacientes de urgencia:', error);
            next(error);
        }
    },

    mostrarFormularioNuevo(req, res) {
        res.render('pacienteUrgencia/nuevo', {
            title: 'Registrar Paciente de Urgencia'
        });
    },

    async insertarUrgencia(req, res, next) {
        const { nombre, fecha_hora, observacion } = req.body;
        
        if (!nombre || !fecha_hora || !observacion) {
            return res.status(400).render('pacienteUrgencia/nuevo', {
                title: 'Registrar Paciente de Urgencia',
                error: 'Todos los campos son obligatorios.'
            });
        }

        try {
            await PacienteUrgencia.insertar({ nombre, fecha_hora, observacion });
            res.redirect('/pacientes-urgencia');
        } catch (error) {
            console.error('Error al insertar paciente de urgencia:', error);
            res.status(500).render('pacienteUrgencia/nuevo', {
                title: 'Registrar Paciente de Urgencia',
                error: 'Ocurrió un error al guardar el paciente de urgencia.'
            });
        }
    },

    async eliminarUrgencia(req, res, next) {
        const { id } = req.params;
        try {
            await PacienteUrgencia.eliminar(id);
            res.redirect('/pacientes-urgencia');
        } catch (error) {
            console.error('Error al eliminar paciente de urgencia:', error);
            next(error);
        }
    },

    async actualizarUrgencia(req, res, next) {
        const { id } = req.params;
        try {
            await PacienteUrgencia.eliminar(id);
            res.redirect('/pacientes/nuevo');
        } catch (error) {
            console.error('Error al iniciar actualización de urgencia (eliminar y redirigir):', error);
            next(error);
        }
    }
};

module.exports = PacienteUrgenciaController;
