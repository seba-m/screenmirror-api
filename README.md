# screenmirror-api

## Instalación

1. Clona el repositorio en tu máquina local.
2. Navega hasta el directorio del proyecto.
3. Ejecuta `npm install` para instalar todas las dependencias del proyecto, las cuales están listadas en el archivo `package.json`.

## Configuración

1. Copia el archivo `.env.example` y renómbralo a `.env`.
2. Abre el archivo `.env` y configura las variables de entorno según tus necesidades.

## Ejecución

1. Para iniciar el servidor, ejecuta `npm start`. Esto debería iniciar el servidor en el puerto especificado en tu archivo `.env`.
2. Si estás utilizando Docker, puedes construir la imagen con `docker build -t nombre-de-tu-imagen .` y luego ejecutarla con `docker run -p 8000:8000 nombre-de-tu-imagen`.

## Recordatorio

Recuerda que para que el servidor funcione correctamente, debes tener instalado y ejecutándose el servidor de MongoDB, ademas de que el puerto por defecto para mostrar el video es el `8888`.
