# ServSoftBagm - Documentación Maestra

**Proyecto:** ServSoftBagm  
**Última actualización:** 2026-05-30

---

## Estructura de la Documentación

Esta carpeta contiene toda la documentación organizada del proyecto.

### Arquitectura

- [Architecture Overview](architecture/ARCHITECTURE_OVERVIEW.md)
- [Diagrama de Clases](architecture/CLASS_DIAGRAM.md)
- [Diagrama de Despliegue](deployment/DEPLOYMENT_DIAGRAM.md)

### Base de Datos

- [Diagrama Entidad-Relación (ERD)](database/ENTITY_RELATIONSHIP_DIAGRAM.md)
- Esquema actual (SQLite + planned PostgreSQL)

### Despliegue

- [Guía de Despliegue en Render](DEPLOY_RENDER.md) (en raíz)
- [Deployment Diagram](deployment/DEPLOYMENT_DIAGRAM.md) ← (pendiente)

### Guías y Procesos

- [Guía del Portal del Cliente y 2FA](CLIENT_PORTAL_AND_2FA_GUIDE.md) (en raíz)
- [Proceso: Intake de Cliente vía Chatbot](guides/PROCESS_CLIENT_INTAKE.md)
- [Plan de Automatización y Migración](AUTOMATION_AND_MIGRATION_PLAN.md) (en raíz)
- [Roadmap de Producción](PRODUCTION_ROADMAP.md) (en raíz)

### Desarrollo

- [Guía de Desarrollo Local](guides/DEVELOPMENT_GUIDE.md) ← (pendiente)
- [Checklist de Producción](docs/PRODUCTION_CHECKLIST.md)

---

## Documentos Históricos (en raíz)

Estos documentos existen desde fases anteriores del proyecto. Se conservan como referencia histórica:

- `MASTERDOC.md`
- `ANALYSIS.md`
- `START_HERE.md`
- `README.md`

**No modificar directamente.** Si necesitas actualizar información, crea una nueva versión dentro de `/docs` y referencia la antigua.

---

## Cómo contribuir a la documentación

1. Los documentos vivos deben estar dentro de `/docs`.
2. Usa Mermaid para todos los diagramas (ERD, secuencia, clases, despliegue).
3. Mantén los documentos en español (lenguaje del equipo).
4. Al actualizar un documento importante, aumenta la versión en el encabezado.

---

**Índice principal de referencia para todo el equipo.**