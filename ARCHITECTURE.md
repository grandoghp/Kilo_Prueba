# Arquitectura del Proyecto GameStore

## 📋 Descripción General

GameStore es una aplicación web de comercio electrónico especializada en la venta de videojuegos, construida con tecnologías modernas de pila completa. La aplicación permite a los usuarios explorar un catálogo de juegos, agregar productos al carrito de compras, gestionar pedidos y realizar compras en tiempo real.

## 🏗️ Arquitectura General

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (Next.js)     │◄──►│   (SQLite)      │
│                 │    │                 │    │                 │
│ - React Components│   │ - API Routes    │    │ - Prisma ORM    │
│ - TypeScript     │    │ - RESTful APIs  │    │ - Models:       │
│ - Tailwind CSS   │    │ - Validation     │    │   User, Game,  │
│ - Zustand        │    │ - Error Handling │    │   Order, Cart  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Real-time       │
                    │ (Socket.IO)     │
                    │                 │
                    │ - WebSocket     │
                    │ - Echo Server   │
                    │ - Live Updates  │
                    └─────────────────┘
```

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** - Framework React con App Router para renderizado del lado del servidor
- **React 19** - Biblioteca para construcción de interfaces de usuario
- **TypeScript 5** - JavaScript con tipado estático
- **Tailwind CSS 4** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI accesibles basados en Radix UI
- **Zustand** - Gestión de estado simple y escalable
- **Framer Motion** - Animaciones y transiciones

### Backend
- **Next.js API Routes** - APIs RESTful integradas
- **Prisma** - ORM de base de datos type-safe
- **SQLite** - Base de datos embebida para desarrollo
- **Zod** - Validación de esquemas TypeScript-first
- **Socket.IO** - Comunicación en tiempo real vía WebSockets

### Desarrollo y Herramientas
- **ESLint** - Linting y formateo de código
- **TypeScript** - Compilación y verificación de tipos
- **Nodemon** - Reinicio automático del servidor en desarrollo
- **tsx** - Ejecutor TypeScript para Node.js

## 📁 Estructura del Proyecto

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── cart/                 # Gestión del carrito
│   │   ├── games/                # CRUD de juegos
│   │   ├── orders/               # Gestión de pedidos
│   │   ├── health/               # Endpoint de salud
│   │   └── seed/                 # Poblado inicial de BD
│   ├── favicon.ico
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página principal
├── components/                   # Componentes React reutilizables
│   ├── ui/                       # Componentes base shadcn/ui
│   ├── CartButton.tsx            # Botón del carrito
│   ├── CartSidebar.tsx           # Panel lateral del carrito
│   ├── CategoryFilter.tsx        # Filtro por categorías
│   ├── GameCard.tsx              # Tarjeta de juego
│   ├── HeroBanner.tsx            # Banner principal
│   └── SearchBar.tsx             # Barra de búsqueda
├── hooks/                        # Hooks personalizados
│   ├── use-mobile.ts             # Hook para detección móvil
│   ├── use-toast.ts              # Hook para notificaciones
│   └── useCart.tsx               # Hook para gestión del carrito
├── lib/                          # Utilidades y configuraciones
│   ├── db.ts                     # Configuración Prisma
│   ├── socket.ts                 # Configuración Socket.IO
│   └── utils.ts                  # Funciones utilitarias
└── types/                        # Definiciones TypeScript
    └── game.ts                   # Tipos para juegos

prisma/
└── schema.prisma                 # Esquema de base de datos

server.ts                         # Servidor personalizado con Socket.IO
```

## 🗄️ Esquema de Base de Datos

### Modelo de Datos

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  name      String?
  password  String
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  orders    Order[]
  cartItems CartItem[]
}

model Game {
  id          String     @id @default(cuid())
  title       String
  description String
  price       Float
  genre       String
  platform    String
  imageUrl    String
  rating      Float?
  releaseDate DateTime?
  stock       Int        @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  orderItems  OrderItem[]
  cartItems   CartItem[]
}

model Order {
  id        String     @id @default(cuid())
  userId    String
  total     Float
  status    String     @default("pending")
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  user      User       @relation(fields: [userId], references: [id])
  items     OrderItem[]
}

model OrderItem {
  id       String
  orderId  String
  gameId   String
  quantity Int
  price    Float
  order    Order  @relation(fields: [orderId], references: [id])
  game     Game   @relation(fields: [gameId], references: [id])

  @@id([id, orderId])
}

model CartItem {
  id       String
  userId   String
  gameId   String
  quantity Int
  user     User   @relation(fields: [userId], references: [id])
  game     Game   @relation(fields: [gameId], references: [id])

  @@id([id, userId])
}
```

### Relaciones
- **User** ↔ **Order**: Un usuario puede tener múltiples pedidos (1:N)
- **User** ↔ **CartItem**: Un usuario puede tener múltiples items en el carrito (1:N)
- **Game** ↔ **OrderItem**: Un juego puede estar en múltiples pedidos (1:N)
- **Game** ↔ **CartItem**: Un juego puede estar en múltiples carritos (1:N)
- **Order** ↔ **OrderItem**: Un pedido contiene múltiples items (1:N)

## 🔌 API Endpoints

### Games API (`/api/games`)
- **GET** `/api/games` - Obtener todos los juegos
- **POST** `/api/games` - Crear un nuevo juego
- **GET** `/api/games/[id]` - Obtener un juego específico
- **PUT** `/api/games/[id]` - Actualizar un juego
- **DELETE** `/api/games/[id]` - Eliminar un juego

### Cart API (`/api/cart`)
- **GET** `/api/cart?userId={id}` - Obtener items del carrito de un usuario
- **POST** `/api/cart` - Agregar item al carrito
- **PUT** `/api/cart` - Actualizar cantidad de item en carrito
- **DELETE** `/api/cart` - Remover item del carrito

### Orders API (`/api/orders`)
- **GET** `/api/orders` - Obtener todos los pedidos
- **POST** `/api/orders` - Crear un nuevo pedido
- **GET** `/api/orders/[id]` - Obtener un pedido específico

### Health Check (`/api/health`)
- **GET** `/api/health` - Verificar estado del servidor

### Seed API (`/api/seed`)
- **POST** `/api/seed` - Poblar la base de datos con datos de ejemplo

## 🎨 Componentes Principales

### Componentes de UI
- **GameCard**: Muestra información de un juego con opción de agregar al carrito
- **CartSidebar**: Panel lateral que muestra los items del carrito
- **CartButton**: Botón flotante para acceder al carrito
- **HeroBanner**: Banner principal con imagen destacada
- **SearchBar**: Barra de búsqueda para filtrar juegos
- **CategoryFilter**: Filtros por género de juegos

### Gestión de Estado
- **CartProvider**: Contexto global para el estado del carrito
- **useCart**: Hook personalizado para acceder y modificar el carrito

## 🔄 Funcionalidades en Tiempo Real

### Socket.IO Integration
- **Servidor WebSocket**: Integrado en `server.ts` con Next.js
- **Echo Server**: Actualmente implementado como servidor de eco
- **Ruta**: `/api/socketio`
- **Eventos**:
  - `connection`: Cliente se conecta
  - `message`: Mensaje enviado por cliente
  - `disconnect`: Cliente se desconecta

### Configuración del Servidor
```typescript
// server.ts
const io = new Server(server, {
  path: '/api/socketio',
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
```

## 🚀 Despliegue y Producción

### Scripts de Package.json
- **dev**: `nodemon --exec "npx tsx server.ts"` - Desarrollo con reinicio automático
- **build**: `next build` - Construir para producción
- **start**: `NODE_ENV=production tsx server.ts` - Ejecutar en producción
- **lint**: `next lint` - Ejecutar linter

### Variables de Entorno
- **DATABASE_URL**: URL de conexión a la base de datos
- **NODE_ENV**: Entorno de ejecución (development/production)

### Puerto de Ejecución
- **Desarrollo**: Puerto 3000
- **Socket.IO**: Ruta `/api/socketio`

## 🔧 Configuración de Desarrollo

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación
```bash
npm install
```

### Configuración de Base de Datos
```bash
npx prisma generate
npx prisma db push
```

### Poblado de Datos
```bash
# Via API
curl -X POST http://localhost:3000/api/seed

# O ejecutar script directamente
npx tsx seed-script.ts
```

### Ejecución
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📊 Flujo de Datos

1. **Carga Inicial**: La página principal obtiene juegos desde `/api/games`
2. **Filtrado**: Búsqueda y filtros se aplican en el cliente
3. **Carrito**: Items se agregan al estado local y se sincronizan con la API
4. **Checkout**: Se crea un pedido y se actualiza el inventario
5. **Tiempo Real**: Socket.IO maneja actualizaciones en vivo (expandible)

## 🔒 Consideraciones de Seguridad

- Validación de entrada con Zod en todas las APIs
- Sanitización de datos en el frontend
- CORS configurado para desarrollo
- Variables de entorno para configuración sensible

## 🚀 Escalabilidad y Mejoras Futuras

- **Base de Datos**: Migrar a PostgreSQL para producción
- **Autenticación**: Implementar NextAuth.js completamente
- **Cache**: Agregar Redis para sesiones y caché
- **CDN**: Servir imágenes desde CDN
- **Testing**: Agregar suite de pruebas unitarias e integración
- **Monitoreo**: Logs estructurados y métricas de rendimiento
- **WebSockets**: Implementar salas para chat en tiempo real entre usuarios

---

Esta arquitectura proporciona una base sólida y escalable para una tienda de juegos en línea, con separación clara de responsabilidades y tecnologías modernas que facilitan el desarrollo y mantenimiento.