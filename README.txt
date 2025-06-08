TP Integrador Web 2 - Lucero Gontero Martin
Descripción
Este proyecto es una aplicación web para la gestión de pacientes, admisiones, habitaciones y evaluaciones médicas/enfermería en una clínica.
Está desarrollado con Node.js, Express y utiliza una base de datos MySQL.

Cómo iniciar la aplicación localmente
1-Clona o descarga el repositorio completo (incluyendo la carpeta del proyecto y el archivo de la base de datos que se encuentra en la raíz).
2-Instala las dependencias ejecutando en la terminal:
npm install
3-Configura el archivo .env con los datos de tu base de datos local (puedes usar el archivo .env.sample como guía).
4-Importa el archivo SQL de la base de datos (incluido en la raíz del proyecto) en tu servidor MySQL local.
5-Inicia la aplicación con el comando:
npm start

o directamente:
node app.js

Accede a la app en tu navegador en http://localhost:3000

Conexión a la base de datos
La aplicación utiliza variables de entorno para conectarse a la base de datos MySQL.
Debes configurar el archivo .env con tus datos de conexión:

DB_NAME=nombre_de_tu_base
DB_USER=usuario
DB_PASS=contraseña
DB_HOST=localhost
DB_PORT=3306
PORT=3000

Acceso online
También puedes acceder a la aplicación desplegada en Railway en el siguiente enlace:

tpintegradorweb2-lucerogonteromartin-production.up.railway.app