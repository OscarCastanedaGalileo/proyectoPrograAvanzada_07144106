# Instrucciones de Instalación y Configuración

## 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/gestion-habitos.git
cd gestion-habitos
```

## 2. Configurar el backend (Express.js)

### a. Instalar dependencias
```bash
cd backend
npm install
```

### b. Configurar variables de entorno
Crea un archivo `.env` en la carpeta `backend` y agrega la conexión a MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/gestion-habitos
PORT=5000
```

### c. Iniciar el servidor
```bash
npm start
```

## 3. Configurar el frontend (Next.js)

### a. Instalar dependencias
```bash
cd frontend
npm install
```

### b. Iniciar la aplicación
```bash
npm run dev
```

