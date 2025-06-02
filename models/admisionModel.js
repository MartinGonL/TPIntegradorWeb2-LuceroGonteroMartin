const pool = require('../config/db');

const Admision = {
    crear: async (datosAdmision) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
 
            const datosParaInsertar = {
                fecha_admision: new Date(), 
                ...datosAdmision
            };
           
            if (!datosParaInsertar.estado_admision) {
                datosParaInsertar.estado_admision = 'Activa';
            }

            const [resultado] = await conexion.query("INSERT INTO admisiones SET ?", datosParaInsertar);
            return resultado.insertId;
        } catch (error) {
            console.error('Error en Admision.crear:', error);
            throw error;
        } finally {
            if (conexion) conexion.release(); 
        }
    },


    buscarPorId: async (id) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
           
            const [filas] = await conexion.query("SELECT *, cama_asignada_id FROM admisiones WHERE id = ?", [id]);
            return filas.length > 0 ? filas[0] : null; 
            console.error('Error en Admision.buscarPorId:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    buscarActivasPorIdPaciente: async (idPaciente) => { 
        let conexion;
        try {
            conexion = await pool.getConnection();
           
            const [filas] = await conexion.query("SELECT *, cama_asignada_id FROM admisiones WHERE paciente_id = ? AND estado_admision = 'Activa' ORDER BY fecha_admision DESC", [idPaciente]);
            return filas;
        } catch (error) {
            console.error('Error en Admision.buscarActivasPorIdPaciente:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    actualizarEstado: async (id, estado) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query("UPDATE admisiones SET estado_admision = ? WHERE id = ?", [estado, id]);
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en Admision.actualizarEstado:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },


    listarTodas: async () => {
        let conexion;
        const consulta = `
            SELECT 
                a.*, 
                p.nombre as paciente_nombre, 
                p.apellido as paciente_apellido, 
                p.dni as paciente_dni 
            FROM admisiones a 
            JOIN pacientes p ON a.paciente_id = p.id 
            ORDER BY a.fecha_admision DESC
        `;

        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query(consulta);
            return filas;
        } catch (error) {
            console.error('Error en Admision.listarTodas:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },


    actualizarCamaAsignada: async (idAdmision, idCama) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query(
                "UPDATE admisiones SET cama_asignada_id = ? WHERE id = ?",
                [idCama, idAdmision]
            );
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en Admision.actualizarCamaAsignada:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },


    removerCamaAsignada: async (idAdmision) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query(
                "UPDATE admisiones SET cama_asignada_id = NULL WHERE id = ?",
                [idAdmision]
            );
            return resultado.affectedRows;
        } catch (error) {
            console.error('Error en Admision.removerCamaAsignada:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    }
};

module.exports = Admision;
