const pool = require('../config/db');

const Ala = {
    crear: async (datosAla) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query('INSERT INTO alas SET ?', datosAla);
            return resultado.insertId;
        } catch (error) {
            console.error('Error en Ala.crear:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    listarTodas: async () => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query('SELECT * FROM alas');
            return filas;
        } catch (error) {
            console.error('Error en Ala.listarTodas:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    buscarPorId: async (id) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query('SELECT * FROM alas WHERE id = ?', [id]);
            return filas[0];
        } catch (error) {
            console.error('Error en Ala.buscarPorId:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    actualizar: async (id, datosAla) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query('UPDATE alas SET ? WHERE id = ?', [datosAla, id]);
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en Ala.actualizar:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    eliminar: async (id) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query('DELETE FROM alas WHERE id = ?', [id]);
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en Ala.eliminar:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    }
};

module.exports = Ala;
