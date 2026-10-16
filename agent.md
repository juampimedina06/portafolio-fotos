# Dominio del Proyecto & Propósito de Negocio

- **Propósito**: Portafolio y catálogo de coberturas fotográficas realizadas por Tomás Fotografía en eventos específicos (recitales, fiestas, festivales, shows, sesiones).
- **Flujo de Usuario**: Los asistentes o clientes del evento ingresan a la plataforma para buscar el evento al que asistieron y hacen clic en **"Ver fotos"**, lo que los redirige a la galería/álbum externo (Google Drive, Pixieset, web externa) donde se encuentran todas las fotos tomadas en esa fecha.
- **Regla Conceptual de Dominio**: NO es una plataforma de venta de tickets ni de eventos a futuro. Cada publicación representa un evento ya cubierto con su respectivo álbum de fotos listo para ser visto o descargado.

# Directivas de Diseño & Filosofía Visual

## Principios Fundamentales

1. **Sofisticado, Estético y Natural**:
   - Cada interfaz debe reflejar un diseño editorial, limpio y sereno.
   - Usar paletas claras y naturales (fondos blancos puros y cálidos `#fafafa`/`#fcfcfd`, tipografías en `zinc-900`, tonos secundarios en `zinc-500` y bordes sutiles `zinc-200`).
   - Evitar temas oscuros forzados en áreas públicas y administrativas a menos que se solicite expresamente.

2. **Sin "Tarjetas dentro de Tarjetas" (Anti-Nesting)**:
   - Prohibido el anidamiento innecesario de tarjetas (cajas dentro de cajas con múltiples bordes y sombras densas).
   - La estructura se organiza mediante layouts planos, divisores sutiles (`border-b border-zinc-200/80`), tablas limpias y espacios en blanco que permitan respirar a la interfaz.

3. **Sin Iconos Genéricos Innecesarios**:
   - No saturar la UI con iconos decorativos en cada título, métrica o campo de formulario.
   - Dejar que la tipografía y el espaciado construyan la jerarquía.
   - Conservar únicamente iconos con propósito funcional estricto (ej. buscar, eliminar, editar, cerrar modal).

4. **Tipografía y Micro-interacciones**:
   - Jerarquía tipográfica pulida: etiquetas en mayúsculas de tamaño micro (`text-[11px] font-medium uppercase tracking-wider text-zinc-400`), números de métricas limpios y directos, y botones con transiciones suaves.

# Control de Versiones y Workflow

- **Commits automáticos**: Tras cada cambio o conjunto de modificaciones resueltas, realizar `git add .` y `git commit -m "<descripción de lo realizado>"` siguiendo conventional commits.

