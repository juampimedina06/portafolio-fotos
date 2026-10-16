# Tomás Fotografía & Eventos

Plataforma web y portafolio digital para **Tomás Fotografía**, diseñada para exhibir las coberturas fotográficas realizadas en eventos, recitales, fiestas y shows en vivo. Los asistentes y clientes pueden buscar el evento al que fueron y acceder directamente al álbum o carpeta con todas las fotos tomadas en esa fecha.

---

## 🌟 Características Principales

### 1. Portafolio Público & Enlaces a Galerías
- **Catálogo de Coberturas**: Visualización de eventos cubiertos, ordenados por prioridad y fechas.
- **Acceso Directo a las Fotos**: Botón **"Ver fotos"** en cada evento que redirige a la galería externa (Google Drive, Pixieset, web propia) con conteo automático de visitas/clics.
- **Fondo de Collage Fotográfico**: Mosaico dinámico diagonal con marcos de fotografías en alta resolución y un velo traslúcido para destacar el contenido.
- **Tarjetas en Formato Píldora**: Diseño inspirado en un Link-in-bio editorial, limpio y minimalista.
- **Buscador & Filtros por Categoría**: Filtrado instantáneo por nombre de evento, sala o tipo de cobertura.
- **Compartir Álbum**: Función nativa para compartir el enlace del álbum en redes o copiarlo al portapapeles.

### 2. Panel de Administración
- **Estética Editorial y Natural**: Interfaz en tonos claros (`#fafafa` / blanco), con micro-interacciones suaves, sin anidamiento excesivo de tarjetas y libre de saturación de iconos genéricos.
- **Gestión Integral de Eventos (CRUD)**:
  - Crear, editar y eliminar eventos.
  - Subida directa de flyers mediante Drag & Drop al bucket de Supabase Storage.
  - Toggle de activación inmediata (visibilidad en la web pública).
  - Selector de evento destacado (*featured*).
  - Previsualización en vivo en tiempo real mientras se editan los campos.
- **Personalización de Portada (Hero & Contacto)**:
  - Edición del título principal, bajada y texto del botón de acción.
  - Modificación de la imagen de fondo del Hero.
  - Canales de contacto directo (WhatsApp con enlace directo y perfil de Instagram).

### 3. Autenticación y Seguridad
- Acceso restringido al panel administrativo con Supabase Auth.
- Notificaciones de feedback inmediato mediante toast notifications.

---

## 🛠️ Tecnologías

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Librería UI**: [React 19](https://react.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Base de Datos & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Storage, Auth)
- **Iconografía**: [Lucide React](https://lucide.dev/) (Uso utilitario y minimalista)
- **Notificaciones**: [React Hot Toast](https://react-hot-toast.com/)

---

## 🏛️ Filosofía de Diseño

El sistema visual del proyecto sigue los siguientes lineamientos estrictos:

1. **Sofisticado, Estético y Natural**: Se prioriza una sensación de revista/editorial con fondos luminosos, tipografía nítida y jerarquía clara.
2. **Sin "Tarjetas dentro de Tarjetas"**: Se descartan las estructuras sobrecargadas con cajas anidadas y sombras pesadas; en su lugar, se utilizan divisores lineales sutiles y espacios en blanco orgánicos.
3. **Cero Iconos Innecesarios**: Se evita colocar iconos decorativos de relleno en cada encabezado o dato; la tipografía y el ritmo visual guían al usuario.

---

## 🚀 Puesta en Marcha

### Requisitos Previos
- Node.js (versión 18.18 o superior)
- npm, pnpm o yarn
- Un proyecto configurado en Supabase con las tablas `events`, `site_settings` y el bucket de Storage `event-flyers`.

### Variables de Entorno

Creá un archivo `.env.local` en la raíz del proyecto tomando como referencia `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
```

### Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build

# 4. Iniciar en modo producción
npm run start
```

Abrí [http://localhost:3000](http://localhost:3000) para ver la web pública o [http://localhost:3000/admin](http://localhost:3000/admin) para el panel de administración.

---

## 📂 Estructura del Proyecto

```
├── actions/             # Server Actions (Auth, revalidaciones)
├── app/                 # Rutas App Router (página pública, /admin, login, API)
├── components/          # Componentes modulares
│   ├── admin/           # Componentes del panel administrativo
│   ├── auth/            # Formularios de acceso
│   ├── public/          # Landing pública y tarjetas de eventos
│   └── ui/              # Primitivas de interfaz
├── context/             # React Context (AuthContext)
├── lib/                 # Clientes de Supabase y utilidades
├── services/            # Servicios de acceso a base de datos (eventos, settings)
├── types/               # Definiciones TypeScript de entidades y DTOs
└── utils/               # Formateadores de fecha y URLs
```
