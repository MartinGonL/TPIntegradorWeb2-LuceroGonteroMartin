const pool = require('../config/db');

const EvaluacionMedica = {

    crear: async (datos) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query("INSERT INTO evaluaciones_medicas SET ?", datos);
            return resultado.insertId;
        } catch (error) {
            console.error('Error en EvaluacionMedica.crear:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    obtenerPorId: async (id) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM evaluaciones_medicas WHERE id = ?", [id]);
            return filas[0];
        } catch (error) {
            console.error('Error en EvaluacionMedica.obtenerPorId:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    listarPorAdmision: async (admisionId) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM evaluaciones_medicas WHERE admision_id = ? ORDER BY fecha_evaluacion DESC", [admisionId]);
            return filas;
        } catch (error) {
            console.error('Error en EvaluacionMedica.listarPorAdmision:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    }
};

module.exports = EvaluacionMedica;
