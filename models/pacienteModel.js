const pool = require('../config/db');

const Paciente = {

    insertar: async (datosPaciente) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query("INSERT INTO pacientes SET ?", datosPaciente);
            return resultado.insertId; 
        } catch (error) {
            console.error('Error en Paciente.insertar:', error);
            throw error; 
        } finally {
            if (conexion) conexion.release(); 
        }
    },

    buscarPorDni: async (dni) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM pacientes WHERE dni = ?", [dni]);
            return filas.length > 0 ? filas[0] : null; 
        } catch (error) {
            console.error('Error en Paciente.buscarPorDni:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    buscarPorId: async (id) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM pacientes WHERE id = ?", [id]);
            return filas.length > 0 ? filas[0] : null; 
        } catch (error) {
            console.error('Error en Paciente.buscarPorId:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },


    listarTodos: async () => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [filas] = await conexion.query("SELECT * FROM pacientes ORDER BY apellido, nombre");
            return filas; 
        } catch (error) {
            console.error('Error en Paciente.listarTodos:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },

    actualizar: async (id, datosPaciente) => {
        let conexion;
        try {
            conexion = await pool.getConnection();   
            const [resultado] = await conexion.query("UPDATE pacientes SET ? WHERE id = ?", [datosPaciente, id]);
            return resultado.affectedRows; 
        } catch (error) {
            console.error('Error en Paciente.actualizar:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    },


    eliminar: async (id) => {
        let conexion;
        try {
            conexion = await pool.getConnection();
            const [resultado] = await conexion.query("DELETE FROM pacientes WHERE id = ?", [id]);
            return resultado.affectedRows; 
        } catch (error) {
            console.error('Error en Paciente.eliminar:', error);
            throw error;
        } finally {
            if (conexion) conexion.release();
        }
    }
};

module.exports = Paciente;
