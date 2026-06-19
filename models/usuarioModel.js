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
    }

};

module.exports = Usuario;
