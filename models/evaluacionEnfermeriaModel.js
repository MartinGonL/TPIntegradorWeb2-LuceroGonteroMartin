const pool = require('../config/db');

const EvaluacionEnfermeria = {

    crear: async (datosEvaluacion) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query("INSERT INTO evaluaciones_enfermeria SET ?", datosEvaluacion);
            return resultado.insertId;
        } catch (error) {
            console.error('Error en EvaluacionEnfermeria.crear:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    obtenerPorId: async (id) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM evaluaciones_enfermeria WHERE id = ?", [id]);
            return filas.length > 0 ? filas[0] : null;
        } catch (error) {
            console.error('Error en EvaluacionEnfermeria.obtenerPorId:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    obtenerPorIdAdmision: async (admisionId) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM evaluaciones_enfermeria WHERE admision_id = ? ORDER BY fecha DESC", [admisionId]);
            return filas.length > 0 ? filas[0] : null; // Devolvemos la última evaluación (o la única en este caso)
        } catch (error) {
            console.error('Error en EvaluacionEnfermeria.obtenerPorIdAdmision:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    actualizar: async (id, datosEvaluacion) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query("UPDATE evaluaciones_enfermeria SET ? WHERE id = ?", [datosEvaluacion, id]);
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en EvaluacionEnfermeria.actualizar:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    }
};

module.exports = EvaluacionEnfermeria;
