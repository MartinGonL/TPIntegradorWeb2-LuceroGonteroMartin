const Paciente = require('../models/pacienteModel.js'); 
const Admision = require('../models/admisionModel.js');

const PacienteController = {

    async insertar(req, res, next) { 
        const { nombre, apellido, dni, fechaNacimiento, telefono, email, domicilio, localidad, provincia, cp } = req.body;
        const datosPaciente = { nombre, apellido, dni, fechaNacimiento, telefono, email, domicilio, localidad, provincia, cp };


        const errores = [];
        if (!nombre) errores.push({ msg: 'El campo Nombre es obligatorio.' });
        if (!apellido) errores.push({ msg: 'El campo Apellido es obligatorio.' });
        if (!dni) errores.push({ msg: 'El campo DNI es obligatorio.' });
        if (!fechaNacimiento) errores.push({ msg: 'El campo Fecha de Nacimiento es obligatorio.' });
        if (!telefono) errores.push({ msg: 'El campo Teléfono es obligatorio.' });
        if (!email) errores.push({ msg: 'El campo Email es obligatorio.' });


        if (errores.length > 0) {
            return res.status(400).render('paciente/nuevo', {
                title: 'Registrar Nuevo Paciente', 
                errors: errores, 
                pacienteData: datosPaciente 
            });
        }

        try {
            await Paciente.insertar(datosPaciente);
            res.redirect('/pacientes');
        } catch (error) {
            console.error('Error al insertar el paciente:', error);
  
            return res.status(500).render('paciente/nuevo', {
                title: 'Registrar Nuevo Paciente',
                errors: [{ msg: 'Error al guardar el paciente. Verifique los datos e intente nuevamente. Si el DNI ya existe, no podrá duplicarlo.' }],
                pacienteData: datosPaciente
            });

        }
    },

    async actualizarPaciente(req, res, next) {
        const { id } = req.params;
        const { nombre, apellido, dni, fechaNacimiento, telefono, email, domicilio, localidad, provincia, cp } = req.body;
        const datosPacienteForm = { id, nombre, apellido, dni, fechaNacimiento, telefono, email, domicilio, localidad, provincia, cp };


        const errores = [];
        if (!nombre) errores.push({ msg: 'El campo Nombre es obligatorio.' });
        if (!apellido) errores.push({ msg: 'El campo Apellido es obligatorio.' });
        if (!dni) errores.push({ msg: 'El campo DNI es obligatorio.' });
        if (!fechaNacimiento) errores.push({ msg: 'El campo Fecha de Nacimiento es obligatorio.' });
        if (!telefono) errores.push({ msg: 'El campo Teléfono es obligatorio.' });
        if (!email) errores.push({ msg: 'El campo Email es obligatorio.' });
       

        if (errores.length > 0) {

            return res.status(400).render('paciente/editar', {
                title: `Editar Paciente: ${nombre || 'N/A'} ${apellido || 'N/A'}`,
                errors: errores,
                paciente: datosPacienteForm 
            });
        }


        const datosParaActualizar = { nombre, apellido, dni, fechaNacimiento, telefono, email, domicilio, localidad, provincia, cp };

        try {
            const filasAfectadas = await Paciente.actualizar(id, datosParaActualizar);
            if (filasAfectadas > 0) {
                res.redirect(`/pacientes/${id}`); 
            } else {

                const err = new Error('Paciente no encontrado o ningún dato modificado durante la actualización.');
                err.status = 404; 
                return next(err);
            }
        } catch (error) {
            console.error('Error al actualizar el paciente:', error);

            return res.status(500).render('paciente/editar', {
                title: `Editar Paciente: ${nombre || 'N/A'} ${apellido || 'N/A'}`,
                errors: [{ msg: 'Error al actualizar el paciente. Verifique los datos e intente nuevamente. Si el DNI ya existe para otro paciente, no podrá duplicarlo.' }],
                paciente: datosPacienteForm
            });
        }
    },


    async eliminarPaciente(req, res, next) {
        const { id } = req.params;
        try {
            const filasAfectadas = await Paciente.eliminar(id);
            if (filasAfectadas > 0) {

                res.redirect('/pacientes');
            } else {
                const err = new Error('Paciente no encontrado para eliminar.');
                err.status = 404;
                return next(err);
            }
        } catch (error) {
            console.error('Error al eliminar el paciente:', error);
            next(error); 
        }
    },


    mostrarFormularioNuevo: (req, res) => {
        res.render('paciente/nuevo', { title: 'Registrar Nuevo Paciente' }); 
    },

   
    async listarPacientes(req, res, next) {
        try {
            const pacientes = await Paciente.listarTodos();
            res.render('paciente/lista', {
                title: 'Lista de Pacientes', 
                pacientes: pacientes
            });
        } catch (error) {
            console.error('Error al obtener la lista de pacientes:', error);
            next(error); 
        }
    },

   
    async verPaciente(req, res, next) {
        const { id } = req.params;
        try {
            const paciente = await Paciente.buscarPorId(id);
            if (!paciente) {
                const err = new Error('Paciente no encontrado.');
                err.status = 404;
                return next(err);
            }

            const admisiones = await Admision.buscarActivasPorIdPaciente(id); 

            res.render('paciente/detalle', {
                title: `Detalles del Paciente: ${paciente.nombre} ${paciente.apellido}`, 
                paciente: paciente,
                admisiones: admisiones 
            });
        } catch (error) {
            console.error('Error al obtener detalles del paciente o sus admisiones:', error);
            next(error);
        }
    },

    
    async mostrarFormularioEditar(req, res, next) {
        const { id } = req.params;
        try {
            const paciente = await Paciente.buscarPorId(id);
            if (!paciente) {
                const err = new Error('Paciente no encontrado para editar.');
                err.status = 404;
                return next(err);
            }
            res.render('paciente/editar', {
                title: `Editar Paciente: ${paciente.nombre} ${paciente.apellido}`, 
                paciente: paciente 
            });
        } catch (error) {
            console.error('Error al obtener el paciente para editar:', error);
            next(error);
        }
    }
}
module.exports = PacienteController;