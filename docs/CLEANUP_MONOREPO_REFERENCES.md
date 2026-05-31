# Limpieza de Referencias Antiguas - Migración a Monorepo

**Fecha**: 2026

## Objetivo
Eliminar todas las referencias a las rutas antiguas (`server/`, `client/`) después de la migración a la estructura de monorepo (`apps/server/`, `apps/client/`).

## Archivos Actualizados

### .gitignore
- Actualizadas todas las rutas de builds, .env, backups y datos sensibles de banco/QR para apuntar a `apps/client/` y `apps/server/`.

### Scripts
- `scripts/dev-all.ps1`: Actualizadas rutas de .env.
- `scripts/setup-local.ps1`: Actualizada ruta de .env.

### Documentación
- `README.md`: Actualizada la estructura del repositorio y referencias a carpetas.
- `DEVELOPMENT.md`: Reescrito para reflejar la nueva estructura de monorepo con Turborepo.
- `docs/MONOREPO_MIGRATION.md`: Creado para documentar el proceso de migración.
- `docs/GUIA_DE_ESTUDIO_MONOREPO_Y_ARQUITECTURA.md`: Creado como material de estudio principal.
- `docs/CLEANUP_MONOREPO_REFERENCES.md`: Este documento.

### Docker
- `apps/server/Dockerfile`: Agregado comentario aclarando que está pensado para contexto de monorepo.

## Estado Final
La gran mayoría de referencias antiguas han sido actualizadas. Cualquier referencia residual que aparezca en el futuro puede corregirse de forma puntual.

## Lección
En migraciones de estructura grandes, es crítico realizar búsquedas exhaustivas (`grep` / `Select-String`) tanto en código como en documentación y scripts.
