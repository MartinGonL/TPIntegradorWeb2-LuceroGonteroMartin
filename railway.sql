-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-06-2025 a las 16:01:45
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `railway`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('Admin','Medico','Enfermero') NOT NULL,
  `nombre_completo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `password`, `rol`, `nombre_completo`) VALUES
(1, 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Admin', 'Administrador del Sistema'),
(2, 'medico1', '673ab82a6530ee3bd9b04ee72a4d66afa7fa059aedc685cf44e35d29d90ebafa', 'Medico', 'Dr. Juan Pérez'),
(3, 'enfermero1', '24c1e28fc84b9db1dbb64886f74d2087854fdee36033da450b660f12e1272586', 'Enfermero', 'Enfermero Pedro'),
(4, 'enfermera2', '90bf2403fac61ad700d74a750fbabb599d17097dc98ca07be6caa643a7d23a29', 'Enfermero', 'Enfermera Ana Gómez'),
(5, 'enfermera3', '90bf2403fac61ad700d74a750fbabb599d17097dc98ca07be6caa643a7d23a29', 'Enfermero', 'Enfermera María Rodríguez'),
(6, 'enfermero4', '90bf2403fac61ad700d74a750fbabb599d17097dc98ca07be6caa643a7d23a29', 'Enfermero', 'Enfermero José López'),
(7, 'medico2', '673ab82a6530ee3bd9b04ee72a4d66afa7fa059aedc685cf44e35d29d90ebafa', 'Medico', 'Dra. Ana Gómez'),
(8, 'medico3', '673ab82a6530ee3bd9b04ee72a4d66afa7fa059aedc685cf44e35d29d90ebafa', 'Medico', 'Dr. Carlos Ruiz'),
(9, 'medico4', '673ab82a6530ee3bd9b04ee72a4d66afa7fa059aedc685cf44e35d29d90ebafa', 'Medico', 'Dra. Laura Fernández');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admisiones`
--

CREATE TABLE `admisiones` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `fecha_admision` datetime NOT NULL DEFAULT current_timestamp(),
  `tipo_admision` varchar(50) NOT NULL,
  `medico_referente` varchar(200) DEFAULT NULL,
  `diagnostico_inicial` text DEFAULT NULL,
  `estado_admision` varchar(50) NOT NULL DEFAULT 'Activa',
  `fecha_alta` datetime DEFAULT NULL,
  `cama_asignada_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `admisiones`
--

INSERT INTO `admisiones` (`id`, `paciente_id`, `fecha_admision`, `tipo_admision`, `medico_referente`, `diagnostico_inicial`, `estado_admision`, `fecha_alta`, `cama_asignada_id`) VALUES
(1, 1, '2025-06-02 13:08:52', 'Derivación Médica', 'Calcarami Matias', 'El paciente se encuentra con una fractura en brazo derecho', 'Activa', NULL, NULL),
(2, 6, '2025-06-02 13:14:11', 'Programada', 'calcarami', 'paciente solicito turno para control de rutina', 'Activa', NULL, NULL),
(3, 1, '2025-06-02 13:19:51', 'Emergencia', 'Guardia', 'llega herido de bala se ingresa por urgencia', 'Activa', NULL, NULL),
(4, 1, '2025-06-02 13:33:59', 'Emergencia', 'Guardia', 'llega herido de bala se ingresa por urgencia', 'Completada', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alas`
--

CREATE TABLE `alas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alas`
--

INSERT INTO `alas` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Ala Norte', 'Internación General - Cuidados Básicos'),
(2, 'Ala Sur', 'Cuidados Críticos y Especialidades'),
(3, 'Ala Este', 'Pediatría y Maternidad'),
(4, 'Ala Oeste', 'Unidad de Cuidados Intermedios');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `camas`
--

CREATE TABLE `camas` (
  `id` int(11) NOT NULL,
  `habitacion_id` int(11) NOT NULL,
  `codigo_cama` varchar(20) NOT NULL,
  `estado_cama` varchar(50) NOT NULL DEFAULT 'Libre',
  `paciente_actual_id` int(11) DEFAULT NULL,
  `admision_actual_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `camas`
--

INSERT INTO `camas` (`id`, `habitacion_id`, `codigo_cama`, `estado_cama`, `paciente_actual_id`, `admision_actual_id`) VALUES
(1, 1, 'Cama-N-101-A', 'Libre', NULL, NULL),
(2, 1, 'Cama-N-101-B', 'Libre', NULL, NULL),
(3, 2, 'Cama-N-102-A', 'Libre', NULL, NULL),
(4, 2, 'Cama-N-102-B', 'Libre', NULL, NULL),
(5, 3, 'Cama-N-103', 'Libre', NULL, NULL),
(6, 4, 'Cama-N-104', 'Libre', NULL, NULL),
(7, 5, 'Cama-S-101-A', 'Libre', NULL, NULL),
(8, 5, 'Cama-S-101-B', 'Libre', NULL, NULL),
(9, 6, 'Cama-S-102-A', 'Libre', NULL, NULL),
(10, 6, 'Cama-S-102-B', 'Libre', NULL, NULL),
(11, 7, 'Cama-S-103', 'Libre', NULL, NULL),
(12, 8, 'Cama-S-104', 'Libre', NULL, NULL),
(13, 9, 'Cama-E-101-A', 'Libre', NULL, NULL),
(14, 9, 'Cama-E-101-B', 'Libre', NULL, NULL),
(15, 10, 'Cama-E-102-A', 'Libre', NULL, NULL),
(16, 10, 'Cama-E-102-B', 'Libre', NULL, NULL),
(17, 11, 'Cama-E-103', 'Libre', NULL, NULL),
(18, 12, 'Cama-E-104', 'Libre', NULL, NULL),
(19, 13, 'Cama-O-101-A', 'Libre', NULL, NULL),
(20, 13, 'Cama-O-101-B', 'Libre', NULL, NULL),
(21, 14, 'Cama-O-102-A', 'Libre', NULL, NULL),
(22, 14, 'Cama-O-102-B', 'Libre', NULL, NULL),
(23, 15, 'Cama-O-103', 'Libre', NULL, NULL),
(24, 16, 'Cama-O-104', 'Libre', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluaciones_enfermeria`
--

CREATE TABLE `evaluaciones_enfermeria` (
  `id` int(11) NOT NULL,
  `admision_id` int(11) NOT NULL,
  `enfermero_id` varchar(50) DEFAULT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `motivo_internacion_actual` text DEFAULT NULL,
  `signos_vitales_ta` varchar(20) DEFAULT NULL,
  `signos_vitales_fc` int(11) DEFAULT NULL,
  `signos_vitales_fr` int(11) DEFAULT NULL,
  `signos_vitales_temp` decimal(4,2) DEFAULT NULL,
  `signos_vitales_sato2` int(11) DEFAULT NULL,
  `observaciones_adicionales` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `evaluaciones_enfermeria`
--

INSERT INTO `evaluaciones_enfermeria` (`id`, `admision_id`, `enfermero_id`, `fecha`, `motivo_internacion_actual`, `signos_vitales_ta`, `signos_vitales_fc`, `signos_vitales_fr`, `signos_vitales_temp`, `signos_vitales_sato2`, `observaciones_adicionales`) VALUES
(1, 1, 'Enfermero Pedro', '2025-06-23 16:15:00', 'Paciente ingresa por derivación con fuerte dolor en miembro superior derecho tras caída de altura.', '130/85', 88, 18, 36.70, 98, 'Paciente colaborador, dolor agudo y deformación evidente en brazo derecho.'),
(2, 2, 'Enfermera Ana Gómez', '2025-06-23 16:20:00', 'Ingreso programado para control y chequeo de rutina cardiológico.', '120/80', 72, 16, 36.40, 99, 'Paciente asintomático, normotenso, frecuencia regular.'),
(3, 3, 'Enfermero José López', '2025-06-23 16:25:00', 'Paciente traído de urgencia por personal policial por herida de arma de fuego.', '90/50', 110, 24, 35.90, 92, 'Paciente pálido, estuporoso, sangrado activo controlado en el ingreso.'),
(4, 4, 'Enfermera María Rodríguez', '2025-06-23 16:30:00', 'Paciente herido por arma de fuego ingresado por guardia.', '110/70', 90, 20, 36.20, 95, 'Paciente hemodinámicamente estable tras reanimación inicial.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluaciones_medicas`
--

CREATE TABLE `evaluaciones_medicas` (
  `id` int(11) NOT NULL,
  `admision_id` int(11) NOT NULL,
  `fecha_evaluacion` datetime NOT NULL DEFAULT current_timestamp(),
  `observaciones` text DEFAULT NULL,
  `medico_id` varchar(50) DEFAULT NULL,
  `evaluacion_enfermeria_id` int(11) DEFAULT NULL,
  `diagnostico_principal` text DEFAULT NULL,
  `diagnosticos_secundarios` text DEFAULT NULL,
  `plan_tratamiento_inicial` text DEFAULT NULL,
  `tratamiento_farmacologico` text DEFAULT NULL,
  `tratamiento_no_farmacologico` text DEFAULT NULL,
  `procedimientos_medicos` text DEFAULT NULL,
  `interconsultas_solicitadas` text DEFAULT NULL,
  `solicitud_pruebas_diagnosticas` text DEFAULT NULL,
  `observaciones_evolucion` text DEFAULT NULL,
  `recomendaciones_alta_seguimiento` text DEFAULT NULL,
  `notas_medicas_adicionales` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `evaluaciones_medicas`
--

INSERT INTO `evaluaciones_medicas` (`id`, `admision_id`, `fecha_evaluacion`, `observaciones`, `medico_id`, `evaluacion_enfermeria_id`, `diagnostico_principal`, `diagnosticos_secundarios`, `plan_tratamiento_inicial`, `tratamiento_farmacologico`, `tratamiento_no_farmacologico`, `procedimientos_medicos`, `interconsultas_solicitadas`, `solicitud_pruebas_diagnosticas`, `observaciones_evolucion`, `recomendaciones_alta_seguimiento`, `notas_medicas_adicionales`) VALUES
(1, 1, '2025-06-23 16:35:00', 'Paciente estable en reposo.', 'Dr. Juan Pérez', 1, 'Fractura expuesta de cúbito y radio derecho (AO tipo 22-A1).', 'Politraumatismo leve.', 'Reducción cerrada bajo anestesia e inmovilización con yeso.', 'Morfina 2mg EV, Cefalotina 1g EV cada 6 horas, Diclofenac 75mg IM.', 'Reposo absoluto de miembro afectado, hielo local.', 'Radiografía de brazo anteroposterior y lateral.', 'Traumatología y Ortopedia.', 'Hemograma completo, coagulograma, ECG de riesgo quirúrgico.', 'Favorable tras inmovilización, disminuye la intensidad del dolor.', 'Control radiológico en 7 días, pautas de alarma por síndrome compartimental.', 'Pendiente programar cirugía si hay desplazamiento secundario.'),
(2, 2, '2025-06-23 16:40:00', 'Sin particularidades en el examen cardiovascular.', 'Dra. Ana Gómez', 2, 'Evaluación cardiovascular prequirúrgica.', 'Hipertensión arterial controlada.', 'Continuar con medicación habitual y controles cardiológicos ambulatorios.', 'Enalapril 10mg cada 12 horas.', 'Dieta hiposódica, ejercicio aeróbico leve.', 'Ecocardiograma Doppler, ECG de 12 derivaciones.', 'Cardiología clínica.', 'Laboratorio de rutina con perfil lipídico e ionograma.', 'Estable, ritmo sinusal, sin soplos ni signos de insuficiencia cardíaca.', 'Apto cardiovascular clase I.', 'Todo normal para el control de rutina.'),
(3, 3, '2025-06-23 16:45:00', 'Paciente en estado crítico, requiere monitorización constante.', 'Dr. Carlos Ruiz', 3, 'Shock hipovolémico secundario a herida de arma de fuego en muslo izquierdo.', 'Anemia aguda.', 'Reanimación enérgica con cristaloides y hemoderivados, exploración quirúrgica inmediata.', 'Expansores plasmáticos, transfusión de 2 unidades de glóbulos rojos, Ceftriaxona 2g EV.', 'Oxigenoterapia por máscara, monitoreo continuo invasivo.', 'Compresión local, colocación de accesos venosos gruesos.', 'Cirugía General y Hemoterapia.', 'Hematocrito seriado, compatibilidad de sangre, gases en sangre arterial.', 'Crítica, respuesta parcial a la expansión de volumen.', 'Pase inmediato a quirófano de urgencia.', 'Se da aviso a la fiscalía de turno por hecho de violencia.'),
(4, 4, '2025-06-23 16:50:00', 'Evolución quirúrgica satisfactoria.', 'Dra. Laura Fernández', 4, 'Herida de arma de fuego en región abdominal (con resolución quirúrgica previa exitosa).', 'Postoperatorio de laparotomía exploradora.', 'Alta médica tras evolución postquirúrgica satisfactoria sin complicaciones.', 'Amoxicilina/Ácido Clavulánico 1g c/12h vía oral, Ibuprofeno 400mg c/8h.', 'Curación diaria de herida quirúrgica, dieta blanda progresiva.', 'Retiro de puntos de sutura al décimo día.', 'Cirugía General (control externo).', 'Hemograma de control pre-alta.', 'Paciente deambulando, tolera dieta, heridas limpias en proceso de cicatrización.', 'Reposo relativo por 20 días, evitar esfuerzos físicos, control por consultorio externo.', 'Se firma alta médica.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitaciones`
--

CREATE TABLE `habitaciones` (
  `id` int(11) NOT NULL,
  `ala_id` int(11) NOT NULL,
  `numero_habitacion` varchar(20) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `capacidad` int(11) NOT NULL DEFAULT 1,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitaciones`
--

INSERT INTO `habitaciones` (`id`, `ala_id`, `numero_habitacion`, `tipo`, `capacidad`, `descripcion`) VALUES
(1, 1, 'N-101', 'Compartida', 2, 'Habitación compartida en Ala Norte'),
(2, 1, 'N-102', 'Compartida', 2, 'Habitación compartida en Ala Norte'),
(3, 1, 'N-103', 'Individual', 1, 'Habitación individual en Ala Norte'),
(4, 1, 'N-104', 'Individual', 1, 'Habitación individual en Ala Norte'),
(5, 2, 'S-101', 'Compartida', 2, 'Habitación compartida en Ala Sur'),
(6, 2, 'S-102', 'Compartida', 2, 'Habitación compartida en Ala Sur'),
(7, 2, 'S-103', 'Individual', 1, 'Habitación individual en Ala Sur'),
(8, 2, 'S-104', 'Individual', 1, 'Habitación individual en Ala Sur'),
(9, 3, 'E-101', 'Compartida', 2, 'Habitación compartida en Ala Este'),
(10, 3, 'E-102', 'Compartida', 2, 'Habitación compartida en Ala Este'),
(11, 3, 'E-103', 'Individual', 1, 'Habitación individual en Ala Este'),
(12, 3, 'E-104', 'Individual', 1, 'Habitación individual en Ala Este'),
(13, 4, 'O-101', 'Compartida', 2, 'Habitación compartida en Ala Oeste'),
(14, 4, 'O-102', 'Compartida', 2, 'Habitación compartida en Ala Oeste'),
(15, 4, 'O-103', 'Individual', 1, 'Habitación individual en Ala Oeste'),
(16, 4, 'O-104', 'Individual', 1, 'Habitación individual en Ala Oeste');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `sexo` enum('Masculino','Femenino','Otro') NOT NULL,
  `dni` varchar(20) NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `domicilio` varchar(255) DEFAULT NULL,
  `localidad` varchar(100) DEFAULT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `cp` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `nombre`, `apellido`, `sexo`, `dni`, `fechaNacimiento`, `telefono`, `email`, `domicilio`, `localidad`, `provincia`, `cp`) VALUES
(1, 'Martin', 'Gontero Luter', 'Masculino', '38419062', '1995-02-09', '2664653015', 'skrapykoko38@gmail.com', 'lic 22 mzn 1 casa 4', 'La Punta', 'San Luis', '5710'),
(5, 'Martin', 'pocho la pantera', 'Masculino', '34877616', '1875-01-09', '2664504050', 'skrapykoko3@gmail.com', 'lic 22 mzn 1 casa 87', 'La Punta', 'San Luis', '5710'),
(6, 'mayra dafne', 'gatica', 'Femenino', '34877615', '1990-02-07', '2664606060', 'mayragd@hotmail.com.ar', 'lic 22 mzn 1 casa 8', 'villa de la quebrada', 'San Luis', '5710'),
(8, 'emilia', 'lucero', 'Femenino', '54162571', '2015-08-15', '2664404040', 'martingontero@hotmail.com', 'lic 22 mzn 1 casa 4', 'La Punta', 'San Luis', '5710');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admisiones`
--
ALTER TABLE `admisiones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `cama_asignada_id` (`cama_asignada_id`);

--
-- Indices de la tabla `alas`
--
ALTER TABLE `alas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `camas`
--
ALTER TABLE `camas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `habitacion_id` (`habitacion_id`,`codigo_cama`),
  ADD KEY `fk_camas_paciente` (`paciente_actual_id`),
  ADD KEY `fk_camas_admision` (`admision_actual_id`);

--
-- Indices de la tabla `evaluaciones_enfermeria`
--
ALTER TABLE `evaluaciones_enfermeria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admision_id` (`admision_id`);

--
-- Indices de la tabla `evaluaciones_medicas`
--
ALTER TABLE `evaluaciones_medicas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admision_id` (`admision_id`);

--
-- Indices de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ala_id` (`ala_id`,`numero_habitacion`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admisiones`
--
ALTER TABLE `admisiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `alas`
--
ALTER TABLE `alas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `camas`
--
ALTER TABLE `camas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `evaluaciones_enfermeria`
--
ALTER TABLE `evaluaciones_enfermeria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `evaluaciones_medicas`
--
ALTER TABLE `evaluaciones_medicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `admisiones`
--
ALTER TABLE `admisiones`
  ADD CONSTRAINT `admisiones_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `admisiones_ibfk_2` FOREIGN KEY (`cama_asignada_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `camas`
--
ALTER TABLE `camas`
  ADD CONSTRAINT `camas_ibfk_1` FOREIGN KEY (`habitacion_id`) REFERENCES `habitaciones` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_camas_admision` FOREIGN KEY (`admision_actual_id`) REFERENCES `admisiones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_camas_paciente` FOREIGN KEY (`paciente_actual_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `evaluaciones_enfermeria`
--
ALTER TABLE `evaluaciones_enfermeria`
  ADD CONSTRAINT `evaluaciones_enfermeria_ibfk_1` FOREIGN KEY (`admision_id`) REFERENCES `admisiones` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `evaluaciones_medicas`
--
ALTER TABLE `evaluaciones_medicas`
  ADD CONSTRAINT `evaluaciones_medicas_ibfk_1` FOREIGN KEY (`admision_id`) REFERENCES `admisiones` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_evaluacion_medica_enfermeria` FOREIGN KEY (`evaluacion_enfermeria_id`) REFERENCES `evaluaciones_enfermeria` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD CONSTRAINT `habitaciones_ibfk_1` FOREIGN KEY (`ala_id`) REFERENCES `alas` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
