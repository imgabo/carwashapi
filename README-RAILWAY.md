# CarWash API - Railway Deployment

API REST para sistema de gestión de lavado de autos desarrollada con NestJS y TypeORM.

## 🚀 Despliegue en Railway

### Paso 1: Conectar con Railway

1. Ve a [Railway.app](https://railway.app)
2. Conecta tu cuenta de GitHub
3. Selecciona "Deploy from GitHub repo"
4. Elige este repositorio

### Paso 2: Configurar Base de Datos

Railway detectará automáticamente que necesitas MySQL. Agrega el servicio MySQL:

1. En tu proyecto de Railway, click en   "New Service"
2. Selecciona "Database" → "MySQL"
3. Railway creará automáticamente las variables de entorno

### Paso 3: Variables de Entorno

Configura las siguientes variables en Railway:

```env
# Se configuran automáticamente con MySQL de Railway:
DB_HOST=<auto-generado>
DB_PORT=3306
DB_USERNAME=<auto-generado>
DB_PASSWORD=<auto-generado>
DB_NAME=<auto-generado>

# Debes configurar manualmente:
SECRET=tu-jwt-secret-super-seguro-aqui
NODE_ENV=production
```

### Paso 4: Deploy

Railway iniciará automáticamente el deploy. El proceso incluye:

1. ✅ Instalación de dependencias
2. ✅ Build de la aplicación TypeScript
3. ✅ Inicio del servidor en puerto asignado por Railway

## 📡 Endpoints Principales

- **Health Check**: `GET /api/health`
- **Autenticación**: `POST /api/auth/login`, `POST /api/auth/register`
- **Clientes**: `GET|POST /api/clientes`
- **Empresas**: `GET|POST /api/empresas`
- **Servicios**: `GET|POST /api/servicios`
- **Sucursales**: `GET|POST /api/sucursales`
- **Ventas**: `GET|POST /api/venta`
- **Dashboard**: `GET /api/dashboard/*`

## 🛠️ Stack Tecnológico

- **Framework**: NestJS 11
- **Base de Datos**: MySQL con TypeORM
- **Autenticación**: JWT con Passport
- **Validación**: class-validator
- **Documentos**: ExcelJS para exportar reportes

## 📋 Características

- ✅ Gestión de clientes y empresas
- ✅ Catálogo de servicios de lavado
- ✅ Control de múltiples sucursales
- ✅ Sistema de ventas con servicios personalizados
- ✅ Dashboard con métricas y reportes
- ✅ Exportación a Excel de reportes de ventas
- ✅ Autenticación JWT
- ✅ Validación automática de datos

## 🔧 Desarrollo Local

```bash
# Instalar dependencias
yarn install

# Configurar variables de entorno
cp .env.example .env

# Modo desarrollo
yarn start:dev

# Build para producción
yarn build
yarn start:prod
```

## 📊 Base de Datos

La aplicación utiliza TypeORM con sincronización automática en desarrollo. En producción se recomienda usar migraciones:

```bash
# Generar migración
yarn migration:generate -- -n NombreMigracion

# Ejecutar migraciones
yarn migration:run
```

## 🏥 Monitoreo

- **Health Check**: `/api/health` - Verifica el estado del servicio
- **Logs**: Disponibles en el dashboard de Railway
- **Métricas**: Panel de Railway muestra CPU, memoria y requests

## 🔒 Seguridad

- Validación de entrada con class-validator
- Hashing de contraseñas con bcrypt
- Autenticación JWT
- CORS configurado
- Variables de entorno para datos sensibles

---

**Nota**: Esta aplicación está optimizada para Railway con Dockerfile y configuración específica.