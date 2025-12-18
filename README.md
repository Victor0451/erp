# Sistema ERP Empresarial

[![Version](https://img.shields.io/badge/version-1.5-blue.svg)](https://github.com/victorlongo/erp)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

Un sistema integral de gestión empresarial (ERP) diseñado para pequeñas y medianas empresas, construido con tecnologías modernas para proporcionar una experiencia de usuario excepcional y rendimiento óptimo.

## 🚀 Características Principales

### 📊 Dashboard Ejecutivo
- **Métricas en tiempo real** de ingresos, ventas y gastos
- **Gráficos interactivos** con tendencias de ventas mensuales
- **Alertas de stock** automáticas
- **Resumen de facturación** y cuentas por cobrar/pagar

### 👥 Gestión de Recursos Humanos
- **Base de datos completa** de empleados
- **Cálculo automático de haberes** y deducciones
- **Categorización de puestos** de trabajo
- **Generación de recibos** de sueldo

### 📦 Gestión de Inventario
- **Control de stock** automático
- **Catálogo de productos** con categorización
- **Alertas de stock mínimo**
- **Gestión de proveedores** y compras

### 💰 Gestión Financiera
- **Registro de ventas** y facturación
- **Control de clientes** y proveedores
- **Gestión de compras** y órdenes
- **Reportes financieros** exportables

### 🔐 Sistema Multi-Tenant
- **Aislamiento por empresa** con schemas dedicados
- **Autenticación robusta** con NextAuth.js
- **Control de acceso** basado en roles (Admin/User)
- **Seguridad avanzada** con JWT y encriptación

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca UI moderna
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS utilitario
- **Radix UI** - Componentes primitivos accesibles
- **Recharts** - Gráficos interactivos

### Backend
- **Next.js API Routes** - API RESTful
- **Prisma ORM** - Base de datos con tipado
- **PostgreSQL** - Base de datos relacional
- **NextAuth.js** - Autenticación completa

### DevOps & Tools
- **ESLint** - Linting de código
- **Docker** - Contenedorización
- **Vercel** - Despliegue recomendado

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18.0 o superior
- **PostgreSQL** 15.0 o superior
- **npm** o **yarn** o **pnpm**

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/victorlongo/erp.git
cd erp
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. Configurar la base de datos

Crea una base de datos PostgreSQL y configura las variables de entorno:

```bash
# Crear archivo .env.local
cp .env.example .env.local
```

Edita `.env.local` con tus configuraciones:

```env
# Base de datos
DATABASE_URL="postgresql://username:password@localhost:5432/erp_db"

# NextAuth
NEXTAUTH_SECRET="tu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Email (opcional, para recuperación de contraseña)
EMAIL_SERVER_HOST=""
EMAIL_SERVER_PORT=""
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM=""
```

### 4. Configurar Prisma

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push
```

### 5. Ejecutar el proyecto

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
erp/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Páginas de autenticación
│   ├── (protected)/              # Páginas protegidas
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── admin/                # Panel de administración
│   └── api/                      # API Routes
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base (shadcn/ui)
│   ├── dashboard-container.tsx   # Dashboard principal
│   ├── table-*.tsx              # Tablas de datos
│   └── dialog-*.tsx             # Modales CRUD
├── lib/                          # Utilidades
│   ├── db.ts                     # Configuración Prisma
│   ├── utils.ts                  # Funciones helper
│   └── export-to-excel.ts        # Exportación Excel
├── prisma/                       # Base de datos
│   ├── schema/                   # Schema Prisma
│   └── migrations/               # Migraciones DB
├── auth.ts                       # Configuración NextAuth
├── middleware.ts                 # Middleware Next.js
└── tailwind.config.ts           # Configuración Tailwind
```

## 🔧 Configuración de Desarrollo

### Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Ejecutar ESLint
```

### Base de datos

Para inspeccionar la base de datos durante el desarrollo:

```bash
# Abrir Prisma Studio
npx prisma studio
```

## 📖 Uso del Sistema

### Primeros Pasos

1. **Registro de Empresa**: Crear una cuenta y configurar la empresa
2. **Configuración Inicial**:
   - Crear categorías de productos
   - Registrar proveedores
   - Configurar empleados y categorías

3. **Operaciones Diarias**:
   - Registrar compras y ventas
   - Gestionar inventario
   - Procesar nómina

### Roles de Usuario

- **Admin**: Acceso completo a todas las funciones
- **User**: Acceso limitado según permisos

## 🔌 API Documentation

### Endpoints Principales

#### Autenticación
```
POST /api/auth/signin     # Login
POST /api/auth/signout    # Logout
GET  /api/auth/session    # Sesión actual
```

#### Empleados
```
GET    /api/empleados?f=traer empleados     # Listar empleados
POST   /api/empleados                      # Crear empleado
PUT    /api/empleados                      # Actualizar empleado
DELETE /api/empleados?f=eliminar empleado  # Eliminar empleado
```

#### Productos
```
GET    /api/productos?f=traer productos    # Listar productos
POST   /api/productos                     # Crear producto
PUT    /api/productos                     # Actualizar producto
DELETE /api/productos                     # Eliminar producto
```

#### Ventas
```
GET    /api/ventas                        # Listar ventas
POST   /api/ventas                        # Registrar venta
```

#### Informes
```
GET    /api/informes?f=est ventas y compras  # Estadísticas generales
GET    /api/informes?f=ventas por mes        # Ventas mensuales
GET    /api/informes?f=stock alertas         # Alertas de stock
```

### Parámetros de Query

La mayoría de los endpoints usan el parámetro `f` (función) para determinar la operación:

```javascript
// Ejemplo de llamada
fetch('/api/empleados?f=traer empleados')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Guías de Contribución

- Sigue las convenciones de código existentes
- Agrega tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Asegúrate de que todos los tests pasen

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

**Ing. Longo Victor Manuel**
- Email: victor.m.longo@gmail.com
- LinkedIn: [Victor Longo](https://linkedin.com/in/victorlongo)
- GitHub: [@victorlongo](https://github.com/victorlongo)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - El framework React
- [Prisma](https://prisma.io/) - ORM moderno
- [Radix UI](https://radix-ui.com/) - Componentes accesibles
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI

---

**⭐ Si este proyecto te resulta útil, ¡dale una estrella!**
