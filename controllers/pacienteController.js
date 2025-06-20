const Paciente = require('../models/pacienteModel.js'); 
const Admision = require('../models/admisionModel.js');

const PacienteController = {

    async insertar(req, res, next) { 
        const { nombre, apellido, dni, fechaNacimiento, telefono, email, domicilio, localidad, provincia, cp } = req.body;
        const datosPaciente = { nombre, apellido, dni, fechaNacimiento, telefono, email, domicilio, localidad, provincia, cp };

        const provinciasValidas = [
            "Buenos Aires","Catamarca","Chaco","Chubut","Córdoba","Corrientes","Entre Ríos","Formosa","Jujuy","La Pampa","La Rioja","Mendoza","Misiones","Neuquén","Río Negro","Salta","San Juan","San Luis","Santa Cruz","Santa Fe","Santiago del Estero","Tierra del Fuego","Tucumán"
        ];

        const errores = [];
        if (!nombre || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(nombre))
         errores.push({ param: 'nombre', msg: 'El campo Nombre es obligatorio y solo debe contener letras.' });

        if (!apellido || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(apellido))
         errores.push({ param: 'apellido', msg: 'El campo Apellido es obligatorio y solo debe contener letras.' });

        if (!dni || !/^\d{7,8}$/.test(dni))
         errores.push({ param: 'dni', msg: 'El campo DNI es obligatorio y debe tener 7 u 8 números.' });

        if (!fechaNacimiento || isNaN(Date.parse(fechaNacimiento)) || new Date(fechaNacimiento) >= new Date())
         errores.push({ param: 'fechaNacimiento', msg: 'Ingrese una fecha de nacimiento válida y anterior a hoy.' });

        if (!telefono || !/^\d{8,}$/.test(telefono))
         errores.push({ param: 'telefono', msg: 'El campo Teléfono es obligatorio y debe tener al menos 8 números.' });

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
         errores.push({ param: 'email', msg: 'Ingrese un email válido.' });

        if (cp && !/^\d{4,5}$/.test(cp))
         errores.push({ param: 'cp', msg: 'El Código Postal debe tener 4 o 5 números.' });

        if (!provincia || !provinciasValidas.includes(provincia))
         errores.push({ param: 'provincia', msg: 'Seleccione una provincia válida.' });

        if (errores.length > 0) {    
        const erroresObj = errores.reduce((obj, error) => {
        obj[error.param] = error;
        return obj;
        }, {});

        return res.status(400).render('paciente/nuevo', {
        title: 'Registrar Nuevo Paciente',
        errors: erroresObj, 
        paciente: datosPaciente
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

        const provinciasValidas = [
            "Buenos Aires","Catamarca","Chaco","Chubut","Córdoba","Corrientes","Entre Ríos","Formosa","Jujuy","La Pampa","La Rioja","Mendoza","Misiones","Neuquén","Río Negro","Salta","San Juan","San Luis","Santa Cruz","Santa Fe","Santiago del Estero","Tierra del Fuego","Tucumán"
        ];

        const errores = [];
        if (!nombre || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(nombre))
            errores.push({ msg: 'El campo Nombre es obligatorio y solo debe contener letras.' });

        if (!apellido || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(apellido))
            errores.push({ msg: 'El campo Apellido es obligatorio y solo debe contener letras.' });

        if (!dni || !/^\d{7,8}$/.test(dni))
            errores.push({ msg: 'El campo DNI es obligatorio y debe tener 7 u 8 números.' });

        if (!fechaNacimiento || isNaN(Date.parse(fechaNacimiento)) || new Date(fechaNacimiento) >= new Date())
            errores.push({ msg: 'Ingrese una fecha de nacimiento válida y anterior a hoy.' });

        if (!telefono || !/^\d{8,}$/.test(telefono))
            errores.push({ msg: 'El campo Teléfono es obligatorio y debe tener al menos 8 números.' });

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            errores.push({ msg: 'Ingrese un email válido.' });

        if (cp && !/^\d{4,5}$/.test(cp))
            errores.push({ msg: 'El Código Postal debe tener 4 o 5 números.' });

        if (!provincia || !provinciasValidas.includes(provincia))
            errores.push({ msg: 'Seleccione una provincia válida.' });

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
    },

async generarPacienteAutomatico(req, res, next) {
    try {        
        const dni = Math.floor(10000000 + Math.random() * 90000000);
        const existe = await Paciente.buscarPorDni(dni);
        if (existe) {            
            return res.status(400).json({ error: "El DNI generado ya está en uso" });
        }

        const datosAutomaticos = {
            nombre: "Paciente",
            apellido: "Automático",
            dni: dni, 
            fechaNacimiento: "1990-01-01",
            telefono: "123456789",
            email: `auto${Date.now()}@example.com`,
            domicilio: "Calle Ficticia 123",
            localidad: "Ciudad Automática",
            provincia: "Buenos Aires",
            cp: "1234"
        };

        const idPaciente = await Paciente.insertar(datosAutomaticos);
        
        const pacienteGenerado = await Paciente.buscarPorId(idPaciente);
        res.json(pacienteGenerado);
        
    } catch (error) {
        console.error("Error al generar paciente automático:", error);
        res.status(500).json({ error: "No se pudo generar el paciente" });
    }
}
}
module.exports = PacienteController;