const pool = require('../config/db');

const Usuario = {

    buscarPorNombreUsuario: async (nombre_usuario) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM usuarios WHERE nombre_usuario = ?", [nombre_usuario]);
            return filas.length > 0 ? filas[0] : null;
        } catch (error) {
            console.error('Error en Usuario.buscarPorNombreUsuario:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    listarPorRol: async (rol) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM usuarios WHERE rol = ?", [rol]);
            return filas;
        } catch (error) {
            console.error('Error en Usuario.listarPorRol:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    listarTodos: async () => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM usuarios ORDER BY nombre_completo");
            return filas;
        } catch (error) {
            console.error('Error en Usuario.listarTodos:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    crear: async (datosUsuario) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query("INSERT INTO usuarios SET ?", [datosUsuario]);
            return resultado.insertId;
        } catch (error) {
            console.error('Error en Usuario.crear:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    buscarPorId: async (id) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM usuarios WHERE id = ?", [id]);
            return filas.length > 0 ? filas[0] : null;
        } catch (error) {
            console.error('Error en Usuario.buscarPorId:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    actualizar: async (id, datosUsuario) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query("UPDATE usuarios SET ? WHERE id = ?", [datosUsuario, id]);
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en Usuario.actualizar:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    eliminar: async (id) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query("DELETE FROM usuarios WHERE id = ?", [id]);
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en Usuario.eliminar:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    }

};

module.exports = Usuario;
