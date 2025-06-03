const pool = require('../config/db');

const Cama = {

    crear: async (datosCama) => {
        let conexion; 
        try {
            conexion = await pool.getConnection();
            const datosParaInsertar = { ...datosCama };
            if (!datosParaInsertar.estado_cama) {
                datosParaInsertar.estado_cama = 'Libre'; 
            }
            const [resultado] = await conexion.query("INSERT INTO camas SET ?", datosParaInsertar);
            return resultado.insertId;
        } catch (error) {
            console.error('Error en Cama.crear:', error);
            throw error; 
        } finally {
            if (conexion) conexion.release(); 
        }
    },

    obtenerPorId: async (id) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM camas WHERE id = ?", [id]);
            return filas.length > 0 ? filas[0] : null; 
        } catch (error) {
            console.error('Error en Cama.obtenerPorId:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    listarPorIdHabitacion: async (idHabitacion) => { 
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM camas WHERE habitacion_id = ? ORDER BY codigo_cama", [idHabitacion]);
            return filas;
        } catch (error) {
            console.error('Error en Cama.listarPorIdHabitacion:', error); 
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    listarTodas: async () => {
        let conexion;
        const consulta = `
            SELECT c.*, h.numero_habitacion, a.nombre as ala_nombre 
            FROM camas c 
            JOIN habitaciones h ON c.habitacion_id = h.id 
            JOIN alas a ON h.ala_id = a.id 
            ORDER BY a.nombre, h.numero_habitacion, c.codigo_cama
        `;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query(consulta);
            return filas;
        } catch (error) {
            console.error('Error en Cama.listarTodas:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    listarCamasLibres: async () => { 
        let conexion;
        const consulta = `
            SELECT c.*, h.numero_habitacion, a.nombre as ala_nombre 
            FROM camas c 
            JOIN habitaciones h ON c.habitacion_id = h.id 
            JOIN alas a ON h.ala_id = a.id 
            WHERE c.estado_cama = 'Libre' OR c.estado_cama = 'Higienizada' 
            ORDER BY a.nombre, h.numero_habitacion, c.codigo_cama
        `;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query(consulta);
            return filas;
        } catch (error) {
            console.error('Error en Cama.listarCamasLibres:', error); 
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    actualizarEstado: async (id, estadoCama) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query("UPDATE camas SET estado_cama = ? WHERE id = ?", [estadoCama, id]);
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en Cama.actualizarEstado:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    asignarPaciente: async (idCama, idPaciente, idAdmision) => {
        let conexion;
        const consulta = `
            UPDATE camas 
            SET estado_cama = 'Ocupada', paciente_actual_id = ?, admision_actual_id = ? 
            WHERE id = ? AND (estado_cama = 'Libre' OR estado_cama = 'Higienizada')
        `;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query(consulta, [idPaciente, idAdmision, idCama]);
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en Cama.asignarPaciente:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    liberarCama: async (idCama) => {
        let conexion;
        const consulta = `
            UPDATE camas 
            SET estado_cama = 'Libre', paciente_actual_id = NULL, admision_actual_id = NULL 
            WHERE id = ?
        `;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query(consulta, [idCama]);
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en Cama.liberarCama:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    actualizar: async (id, datosCama) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const { habitacion_id, codigo_cama, estado_cama } = datosCama;
            const [resultado] = await conexion.query(
                "UPDATE camas SET habitacion_id = ?, codigo_cama = ?, estado_cama = ? WHERE id = ?",
                [habitacion_id, codigo_cama, estado_cama, id]
            );
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en Cama.actualizar (general):', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    eliminar: async (id) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query("DELETE FROM camas WHERE id = ?", [id]);
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en Cama.eliminar:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    listarPorIdPacienteYIdAdmision: async (idPaciente, idAdmision) => { 
        let conexion;
        const consulta = `
            SELECT * 
            FROM camas 
            WHERE paciente_actual_id = ? AND admision_actual_id = ? AND estado_cama = 'Ocupada' 
            LIMIT 1 
        `; 
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query(consulta, [idPaciente, idAdmision]);
            return filas; 
        } catch (error) {
            console.error('Error en Cama.listarPorIdPacienteYIdAdmision:', error); 
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    }
};

module.exports = Cama;
