FROM node:20.4

# Copia los archivos de tu aplicación Node.js al contenedor
COPY . /app

# Establece el directorio de trabajo
WORKDIR /app

# Instala las dependencias
RUN npm install

# Define el comando para ejecutar tu aplicación Node.js
CMD ["npm", "start"]
