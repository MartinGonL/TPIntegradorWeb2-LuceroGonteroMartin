const Admision = require('../models/admisionModel');
const Paciente = require('../models/pacienteModel');
const Cama = require('../models/camaModel');
const Habitacion = require('../models/habitacionModel');
const pool = require('../config/db');

const AsignacionCamaController = {

    async mostrarFormularioAsignacion(req, res, next) {
        const { admisionId } = req.params;
        try {
            const admision = await Admision.buscarPorId(admisionId);
            if (!admision) {
                const err = new Error('Admisión no encontrada.');
                err.status = 404;
                return next(err);
            }

            const paciente = await Paciente.buscarPorId(admision.paciente_id);
            const camasDisponiblesRaw = await Cama.listarCamasLibres();

            // Filtrar camas por sexo de habitación (Lógica de Negocio)
            const camasDisponibles = [];
            for (const cama of camasDisponiblesRaw) {
                // Obtener sexos de pacientes en la misma habitación (consulta combinada y robusta)
                let conexion;
                try {
                    conexion = await pool.getConnection();
                    const [ocupantes] = await conexion.query( //se crea la variable de ocupantes
                        `SELECT DISTINCT p.sexo 
                         FROM pacientes p
                         WHERE p.id IN (
                             SELECT paciente_actual_id 
                             FROM camas 
                             WHERE habitacion_id = ? AND estado_cama = 'Ocupada' AND paciente_actual_id IS NOT NULL
                             
                             UNION
                             
                             SELECT a.paciente_id 
                             FROM admisiones a
                             JOIN camas c ON a.cama_asignada_id = c.id
                             WHERE c.habitacion_id = ? AND a.estado_admision = 'Activa' AND a.paciente_id IS NOT NULL
                         )`,
                        [cama.habitacion_id, cama.habitacion_id] //envia los valores a la consulta de la query
                    );

                    // Si la habitación está vacía o todos son del mismo sexo (comparación normalizada)
                    const mismoSexo = ocupantes.every(o => 
                        o.sexo && paciente.sexo && o.sexo.trim().toLowerCase() === paciente.sexo.trim().toLowerCase()
                    );
                    if (ocupantes.length === 0 || mismoSexo) {
                        camasDisponibles.push(cama);
                    }
                } finally {
                    if (conexion) conexion.release();
                }
            }

            res.render('asignacion/asignar', {
                title: 'Asignar Cama a Paciente',
                admision: admision,
                paciente: paciente,
                camasDisponibles: camasDisponibles
            });
        } catch (error) {
            console.error('Error al mostrar formulario de asignación:', error);
            next(error);
        }
    },

    async asignarCama(req, res, next) {
        const { admisionId } = req.params;
        const { cama_id } = req.body;

        let conexion;
        try {
            const admision = await Admision.buscarPorId(admisionId);
            const paciente = await Paciente.buscarPorId(admision.paciente_id);
            const cama = await Cama.obtenerPorId(cama_id);

            if (!admision || !paciente || !cama) {
                throw new Error('Datos de asignación no válidos.');
            }

            // Validar que la cama esté disponible
            if (cama.estado_cama !== 'Libre' && cama.estado_cama !== 'Higienizada') {
                throw new Error('La cama seleccionada ya no está disponible.');
            }

            // Validar sexo nuevamente por seguridad (concurrencia)
            conexion = await pool.getConnection();
            const [ocupantes] = await conexion.query(
                `SELECT DISTINCT p.sexo 
                 FROM pacientes p
                 WHERE p.id IN (
                     SELECT paciente_actual_id 
                     FROM camas 
                     WHERE habitacion_id = ? AND estado_cama = 'Ocupada' AND paciente_actual_id IS NOT NULL
                     
                     UNION
                     
                     SELECT a.paciente_id 
                     FROM admisiones a
                     JOIN camas c ON a.cama_asignada_id = c.id
                     WHERE c.habitacion_id = ? AND a.estado_admision = 'Activa' AND a.paciente_id IS NOT NULL
                 )`,
                [cama.habitacion_id, cama.habitacion_id]
            );

            const mismoSexo = ocupantes.every(o => 
                o.sexo && paciente.sexo && o.sexo.trim().toLowerCase() === paciente.sexo.trim().toLowerCase()
            );
            if (ocupantes.length > 0 && !mismoSexo) {
                throw new Error('La habitación seleccionada tiene pacientes de otro sexo.');
            }

            // Iniciar Transacción
            await conexion.beginTransaction();

            // 1. Actualizar Cama
            await conexion.query(
                "UPDATE camas SET estado_cama = 'Ocupada', paciente_actual_id = ?, admision_actual_id = ? WHERE id = ?",
                [paciente.id, admision.id, cama.id]
            );

            // 2. Actualizar Admisión
            await conexion.query(
                "UPDATE admisiones SET cama_asignada_id = ? WHERE id = ?",
                [cama.id, admision.id]
            );

            await conexion.commit();
            res.redirect(`/admisiones`); 
        } catch (error) {
            if (conexion) await conexion.rollback();
            console.error('Error al asignar cama:', error);
            next(error);
        } finally {
            if (conexion) conexion.release();
        }
    },

    async liberarCama(req, res, next) {
        const { admisionId } = req.params;
        let conexion;
        try {
            const admision = await Admision.buscarPorId(admisionId);
            if (!admision) {
                const err = new Error('Admisión no encontrada.');
                err.status = 404;
                return next(err);
            }

            conexion = await pool.getConnection();
            await conexion.beginTransaction();

            const camaId = admision.cama_asignada_id;
            if (camaId) {
                await conexion.query(
                    "UPDATE camas SET estado_cama = 'Libre', paciente_actual_id = NULL, admision_actual_id = NULL WHERE id = ?",
                    [camaId]
                );
            }

            await conexion.query(
                "UPDATE admisiones SET cama_asignada_id = NULL WHERE id = ?",
                [admisionId]
            );

            await conexion.commit();
            res.redirect(`/admisiones/${admisionId}`);
        } catch (error) {
            if (conexion) await conexion.rollback();
            console.error('Error al liberar cama:', error);
            next(error);
        } finally {
            if (conexion) conexion.release();
        }
    }
};

module.exports = AsignacionCamaController;
