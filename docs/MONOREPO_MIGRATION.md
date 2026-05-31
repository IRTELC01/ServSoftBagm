# Migración a Monorepo con Turborepo (Nivel 3)

**Fecha**: 2026  
**Objetivo**: Convertir ServSoftBagm en un proyecto profesional con arquitectura separada, excelente experiencia de desarrollo y herramientas modernas.

## Decisión

Se eligió **Nivel 3 (Full profesional)**:

- Estructura de monorepo usando **npm workspaces + Turborepo**.
- Separación clara: `apps/server` y `apps/client`.
- Pipeline centralizado para `dev`, `build`, `lint`.
- Preparación para `packages/` compartidos en el futuro.

## Cambios Realizados

### Estructura
- `server/` → `apps/server/`
- `client/` → `apps/client/`
- Paquetes renombrados:
  - `@servsoftbagm/server`
  - `@servsoftbagm/client`

### Herramientas
- Turborepo instalado y configurado (`turbo.json`)
- Scripts centralizados en la raíz (`npm run dev`, `dev:server`, `dev:client`, `build`, etc.)
- `packageManager` declarado para reproducibilidad.

### Documentación
- `DEVELOPMENT.md` actualizado con la nueva estructura.
- Este documento (`docs/MONOREPO_MIGRATION.md`) creado para registrar el proceso.

## Lecciones Aprendidas

- Turborepo v2 requiere el campo `tasks` (no `pipeline`).
- Es necesario declarar `packageManager` en la raíz cuando se usan workspaces.
- Mover carpetas mientras los procesos de desarrollo están corriendo genera bloqueos (se resolvió matando procesos Node).

## Próximos Pasos Recomendados

- Crear carpeta `packages/` con código compartido (tipos, utilidades, configs).
- Configurar lint y typecheck reales en ambos apps.
- Agregar GitHub Actions básico usando Turborepo.
- Evaluar si se quiere migrar a pnpm o mantener npm.

---

Este cambio representa un avance importante hacia un proyecto mantenible, escalable y profesional, alineado con los principios de Clean Architecture que se han venido aplicando en el código.