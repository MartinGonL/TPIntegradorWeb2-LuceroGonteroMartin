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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluaciones_enfermeria`
--

CREATE TABLE `evaluaciones_enfermeria` (
  `id` int(11) NOT NULL,
  `admision_id` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluaciones_medicas`
--

CREATE TABLE `evaluaciones_medicas` (
  `id` int(11) NOT NULL,
  `admision_id` int(11) NOT NULL,
  `fecha_evaluacion` datetime NOT NULL DEFAULT current_timestamp(),
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
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

INSERT INTO `pacientes` (`id`, `nombre`, `apellido`, `dni`, `fechaNacimiento`, `telefono`, `email`, `domicilio`, `localidad`, `provincia`, `cp`) VALUES
(1, 'Martin', 'Gontero Luter', '38419062', '1995-02-09', '2664653015', 'skrapykoko38@gmail.com', 'lic 22 mzn 1 casa 4', 'La Punta', 'San Luis', '5710'),
(5, 'Martin', 'pocho la pantera', '34877616', '1875-01-09', '2664504050', 'skrapykoko3@gmail.com', 'lic 22 mzn 1 casa 87', 'La Punta', 'San Luis', '5710'),
(6, 'mayra dafne', 'gatica', '34877615', '1990-02-07', '2664606060', 'mayragd@hotmail.com.ar', 'lic 22 mzn 1 casa 8', 'villa de la quebrada', 'San Luis', '5710'),
(8, 'emilia', 'lucero', '54162571', '2015-08-15', '2664404040', 'martingontero@hotmail.com', 'lic 22 mzn 1 casa 4', 'La Punta', 'San Luis', '5710');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `camas`
--
ALTER TABLE `camas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `evaluaciones_enfermeria`
--
ALTER TABLE `evaluaciones_enfermeria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `evaluaciones_medicas`
--
ALTER TABLE `evaluaciones_medicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `evaluaciones_medicas_ibfk_1` FOREIGN KEY (`admision_id`) REFERENCES `admisiones` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD CONSTRAINT `habitaciones_ibfk_1` FOREIGN KEY (`ala_id`) REFERENCES `alas` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
