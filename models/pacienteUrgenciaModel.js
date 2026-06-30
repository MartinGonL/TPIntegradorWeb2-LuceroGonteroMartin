const pool = require('../config/db');

const PacienteUrgencia = {
    insertar: async (datos) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query("INSERT INTO pacientes_urgencia SET ?", datos);
            return resultado.insertId;
        } catch (error) {
            console.error('Error en PacienteUrgencia.insertar:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    buscarPorId: async (id) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM pacientes_urgencia WHERE id = ?", [id]);
            return filas.length > 0 ? filas[0] : null;
        } catch (error) {
            console.error('Error en PacienteUrgencia.buscarPorId:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    listarTodos: async () => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM pacientes_urgencia ORDER BY fecha_hora DESC");
            return filas;
        } catch (error) {
            console.error('Error en PacienteUrgencia.listarTodos:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    eliminar: async (id) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query("DELETE FROM pacientes_urgencia WHERE id = ?", [id]);
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en PacienteUrgencia.eliminar:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    }
};

module.exports = PacienteUrgencia;
