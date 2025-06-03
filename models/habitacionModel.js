const pool = require('../config/db'); 

const Habitacion = {

    crear: async (datosHabitacion) => {
        let conexion; 
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query("INSERT INTO habitaciones SET ?", datosHabitacion);
            return resultado.insertId;
        } catch (error) {
            console.error('Error en Habitacion.crear:', error);
            throw error; 
        } finally {
            if (conexion) conexion.release(); 
        }
    },

    obtenerPorId: async (id) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM habitaciones WHERE id = ?", [id]);
            return filas.length > 0 ? filas[0] : null; 
        } catch (error) {
            console.error('Error en Habitacion.obtenerPorId:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    listarPorIdAla: async (idAla) => { 
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM habitaciones WHERE ala_id = ? ORDER BY numero_habitacion", [idAla]);
            return filas;
        } catch (error) {
            console.error('Error en Habitacion.listarPorIdAla:', error); 
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    listarTodas: async () => { 
        let conexion;
        const consulta = `
            SELECT 
                h.*, 
                a.nombre as ala_nombre 
            FROM habitaciones h 
            JOIN alas a ON h.ala_id = a.id 
            ORDER BY a.nombre, h.numero_habitacion
        `;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query(consulta);
            return filas;
        } catch (error) {
            console.error('Error en Habitacion.listarTodas:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    actualizar: async (id, datosHabitacion) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const { ala_id, numero_habitacion, tipo, capacidad, descripcion } = datosHabitacion;
            const [resultado] = await conexion.query(
                "UPDATE habitaciones SET ala_id = ?, numero_habitacion = ?, tipo = ?, capacidad = ?, descripcion = ? WHERE id = ?",
                [ala_id, numero_habitacion, tipo, capacidad, descripcion, id]
            );
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en Habitacion.actualizar:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    eliminar: async (id) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query("DELETE FROM habitaciones WHERE id = ?", [id]);
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en Habitacion.eliminar:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    }
};

module.exports = Habitacion;
