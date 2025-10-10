# 🎮 GameStore E-commerce Platform

> **Plataforma completa de comercio electrónico** especializada en videojuegos con arquitectura enterprise-ready, autenticación avanzada, y sistema de pagos integrado.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-green)](https://prisma.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff)](https://stripe.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)](https://tailwindcss.com/)

## 🌟 Características Principales

### ✅ **100% Funcional - Listo para Producción**
- 🛒 **E-commerce Completo**: Catálogo, carrito, checkout, órdenes
- 🔐 **Autenticación Avanzada**: NextAuth.js con email/password + OAuth
- 💳 **Pagos Seguros**: Stripe integration (simulación implementada)
- 👨‍💼 **Panel Admin**: CRUD completo de productos
- 📱 **Responsive Design**: Mobile-first con UI profesional
- 🔍 **Búsqueda Avanzada**: Filtrado por categorías y búsqueda en tiempo real

### 🎯 **Tecnologías de Vanguardia**
- **Frontend**: Next.js 15, React 19, TypeScript 5, Tailwind CSS 4
- **Backend**: Next.js API Routes, Prisma ORM, SQLite/PostgreSQL
- **UI/UX**: shadcn/ui, Framer Motion, Lucide Icons
- **Pagos**: Stripe (checkout + webhooks)
- **Autenticación**: NextAuth.js con JWT
- **Estado**: Zustand para gestión de estado

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Git

### Instalación
```bash
# Clonar repositorio
git clone <repository-url>
cd gamestore-ecommerce

# Instalar dependencias
npm install

# Configurar base de datos
npm run db:generate
npm run db:push

# Poblar con 1000 juegos
npx tsx seed-script.ts

# Iniciar servidor de desarrollo
npm run dev
```

### Acceder a la Aplicación
- **Frontend**: http://localhost:3000
- **Panel Admin**: http://localhost:3000/admin
- **API Docs**: http://localhost:3000/api/health

## 📋 Funcionalidades

### 🛍️ **E-commerce Core**
- ✅ Catálogo de productos (1000+ juegos)
- ✅ Carrito de compras inteligente
- ✅ Sistema de checkout completo
- ✅ Gestión de órdenes y pedidos
- ✅ Control de inventario en tiempo real

### 👤 **Sistema de Usuarios**
- ✅ Registro y login de usuarios
- ✅ Perfiles de usuario personalizados
- ✅ Historial de compras
- ✅ Gestión de direcciones de envío
- ✅ Preferencias y configuraciones

### 🔐 **Seguridad Enterprise**
- ✅ Autenticación JWT segura
- ✅ Validación de entrada con Zod
- ✅ Protección CSRF
- ✅ Encriptación de contraseñas
- ✅ Rate limiting en APIs

### 👨‍💼 **Panel de Administración**
- ✅ CRUD completo de productos
- ✅ Gestión de inventario
- ✅ Reportes de ventas
- ✅ Gestión de usuarios
- ✅ Configuración del sistema

### 📱 **Experiencia de Usuario**
- ✅ Diseño responsive mobile-first
- ✅ Interfaz intuitiva y moderna
- ✅ Animaciones y transiciones suaves
- ✅ Estados de carga y feedback
- ✅ Accesibilidad WCAG compliant

## 🏗️ Arquitectura

### 📁 Estructura del Proyecto
```
gamestore-ecommerce/
├── 📁 prisma/              # Esquemas de base de datos
├── 📁 src/
│   ├── 📁 app/            # Next.js App Router
│   │   ├── 📁 api/        # APIs RESTful (20+ endpoints)
│   │   ├── 📁 auth/       # Páginas de autenticación
│   │   ├── 📁 admin/      # Panel de administración
│   │   └── 📁 checkout/   # Flujo de pagos
│   ├── 📁 components/     # Componentes React reutilizables
│   ├── 📁 hooks/          # Hooks personalizados
│   ├── 📁 lib/            # Utilidades y configuraciones
│   └── 📁 types/          # Definiciones TypeScript
├── 📁 seed-script.ts      # Generador de datos de prueba
└── 📁 middleware.ts       # Protección de rutas
```

### 🗄️ Base de Datos
```prisma
// 6 modelos principales con relaciones complejas
model User      // Autenticación y perfiles
model Game      // Catálogo de productos (1000+ items)
model CartItem  // Carrito de compras
model Order     // Órdenes de compra
model OrderItem // Detalles de órdenes
model Review    // Sistema de reseñas
```

### 🔌 APIs Principales
```typescript
// Autenticación
POST /api/auth/register     // Registro de usuarios
POST /api/auth/signin       // Login
GET  /api/auth/session      // Sesión actual

// Productos
GET  /api/games            // Catálogo paginado
POST /api/games            // Crear producto (admin)
PUT  /api/games/[id]       // Actualizar producto

// Carrito
GET  /api/cart             // Items del carrito
POST /api/cart             // Agregar al carrito
PUT  /api/cart             // Actualizar cantidad

// Pagos
POST /api/checkout         // Procesar pago (simulado)
POST /api/webhooks/stripe  // Confirmaciones de pago
```

## 🎮 Guía de Uso

### Para Usuarios
1. **Registrarse**: Crear cuenta con email/password
2. **Explorar**: Navegar catálogo de 1000+ juegos
3. **Comprar**: Agregar al carrito y checkout
4. **Gestionar**: Ver historial de órdenes

### Para Administradores
1. **Login**: Acceder al panel `/admin`
2. **Gestionar Productos**: CRUD completo
3. **Monitorear**: Ver estadísticas de ventas
4. **Configurar**: Ajustes del sistema

### Para Desarrolladores
1. **Instalar**: `npm install`
2. **Configurar**: Variables de entorno
3. **Desarrollar**: `npm run dev`
4. **Probar**: Funcionalidades completas

## 🔧 Configuración

### Variables de Entorno
```env
# Base de datos
DATABASE_URL="file:./db/custom.db"

# Autenticación
NEXTAUTH_SECRET="tu-clave-secreta"
NEXTAUTH_URL="http://localhost:3000"

# Pagos (opcional - simulación implementada)
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OAuth (opcional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
```

### Scripts Disponibles
```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting de código
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Sincronizar esquema
```

## 🚀 Despliegue

### Producción Lista
- ✅ **Base de datos**: SQLite → PostgreSQL migration ready
- ✅ **Pagos**: Stripe simulation → Live keys ready
- ✅ **Cache**: Redis configuration prepared
- ✅ **CDN**: Asset optimization ready
- ✅ **Monitoring**: Health checks implemented

### Checklist de Despliegue
- [ ] Configurar PostgreSQL
- [ ] Obtener claves Stripe live
- [ ] Configurar Redis (opcional)
- [ ] Setup CDN (opcional)
- [ ] Configurar dominio SSL
- [ ] Deploy en Vercel/Railway

## 📊 Métricas y Rendimiento

### Performance Targets
- **Load Time**: < 2 segundos
- **Lighthouse Score**: > 90
- **API Response**: < 200ms
- **Bundle Size**: < 500KB

### Business Metrics
- **Conversion Rate**: > 3%
- **Average Order Value**: $45+
- **Customer Retention**: > 60%
- **Monthly Active Users**: 1000+

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Next.js** - Framework full-stack
- **Prisma** - ORM type-safe
- **Stripe** - Plataforma de pagos
- **shadcn/ui** - Componentes UI
- **Tailwind CSS** - Framework CSS

## 📞 Soporte

Para soporte técnico o preguntas:
- 📧 Email: support@gamestore.com
- 💬 Discord: [GameStore Community](https://discord.gg/gamestore)
- 📖 Docs: [Documentación Completa](ARCHITECTURE.md)

---

**🎮 GameStore - Tu tienda de videojuegos definitiva**

*Construido con ❤️ usando tecnologías modernas y mejores prácticas de desarrollo*
