# Plan de Acción ServSoftBagm 2026 — Fase Post-Monorepo

## 1. Estado Actual (Mayo 2026)

- Proyecto migrado a **monorepo profesional con Turborepo + npm workspaces**.
- Estructura:
  - `apps/server` (@servsoftbagm/server)
  - `apps/client` (@servsoftbagm/client)
- Turborepo gestionando tareas (`dev`, `build`, `lint`).
- Arquitectura interna del backend empezando a separarse (services para Analytics e IA).
- Documentación mejorada (DEVELOPMENT.md, guías de estudio, decisiones arquitectónicas).

## 2. Objetivo General

Llevar ServSoftBagm a un nivel **profesional, mantenible y desplegable** sin incurrir en costos (mantenerse 100% en tiers gratuitos durante la fase de validación).

## 3. Fases de Trabajo

### Fase 1: Estabilización del Monorepo (Actual)
- [x] Migración a estructura `apps/`
- [x] Turborepo básico funcionando
- [ ] Limpiar referencias antiguas restantes
- [ ] Asegurar que `npm run dev` y `npm run build` funcionen perfectamente desde la raíz
- [ ] Actualizar todos los scripts de `/scripts/`

### Fase 2: Arquitectura Interna (Clean / Hexagonal)
- Fortalecer la separación en el backend:
  - `apps/server/src/domain/`
  - `apps/server/src/application/` (casos de uso)
  - `apps/server/src/infrastructure/` (repositorios, adapters)
  - `apps/server/src/interfaces/` (controladores, rutas)
- Mover la lógica de Telemetría e IA ya creada a esta estructura.
- Crear `packages/shared` con tipos y contratos comunes.

### Fase 3: Funcionalidad Crítica
- Completar y estabilizar:
  - Registro manual de leads + contador
  - Sección de Datos Bancarios + QR
  - Flujo completo de Client Portal (OTP real vía Make.com)
  - 2FA admin robusto + recuperación

### Fase 4: Despliegue Gratuito (Zero Cost)
**Stack recomendado (100% free tiers):**

| Servicio          | Plataforma     | Tier Gratuito                  | Notas |
|-------------------|----------------|--------------------------------|-------|
| Frontend          | Vercel         | Hobby (ilimitado)              | Excelente para Vite |
| Backend           | Render.com     | Free Web Service (750h/mes)    | 1 instancia free |
| Base de Datos     | Neon.tech      | 0.5 GB + 1 proyecto free       | Postgres serverless |
| Imágenes/Archivos | Cloudinary     | 25 GB + 25k transformaciones   | Muy generoso gratis |
| Automatizaciones  | Make.com       | 1000 operaciones/mes           | Suficiente para MVP |

**No usar:**
- Railway (se acaba el crédito gratis)
- Fly.io (crédito limitado)
- DigitalOcean App Platform (crédito limitado)

### Fase 5: Calidad y Mantenibilidad
- Agregar ESLint + Prettier configurados vía Turborepo
- TypeScript estricto en ambos apps
- Tests básicos (Vitest en frontend, Jest/Supertest en backend)
- GitHub Actions mínimo (build + lint en PRs)

## 4. Prioridades Inmediatas (Próximas 2-3 semanas)

1. Terminar limpieza de referencias antiguas (scripts + docs).
2. Estabilizar registro de leads manual + contador.
3. Pulir sección de transferencias bancarias.
4. Configurar despliegue en Vercel (frontend) + Render (backend) + Neon (DB).
5. Documentar el flujo completo de "Cómo desplegar gratis".

## 5. Principios que se mantendrán

- **Zero Cost** durante validación (mientras no haya ingresos).
- **Clean Architecture** real en el backend (no solo carpetas).
- **Monorepo maduro** con Turborepo.
- **Documentación viva** (ADRs + guías de estudio).

---

**Próximo hito propuesto:** 
Tener el sistema desplegado en Vercel + Render + Neon (todo gratis) + poder registrar leads y verlos en el dashboard en producción.

¿Quieres que prepare el siguiente documento con los pasos concretos de despliegue gratuito ahora?