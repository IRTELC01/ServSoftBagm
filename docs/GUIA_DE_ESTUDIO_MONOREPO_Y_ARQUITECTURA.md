# Guía de Estudio — ServSoftBagm: Monorepo + Arquitectura Limpia

**Propósito**: Este documento sirve como material de estudio y referencia para entender las decisiones arquitectónicas y de estructura del proyecto.

## 1. ¿Por qué un Monorepo?

### Ventajas
- **Separación clara de responsabilidades**: Backend y Frontend como aplicaciones independientes (`apps/server`, `apps/client`).
- **Herramientas compartidas**: Un solo lugar para configurar Turborepo, lint, builds, etc.
- **Escalabilidad**: Fácil agregar `packages/` compartidos en el futuro (tipos, utilidades, UI components).
- **Experiencia de desarrollo profesional**: Un solo comando (`npm run dev`) levanta todo el stack.

### Costos / Consideraciones
- Se requiere una herramienta de orquestación (Turborepo).
- Los comandos deben ejecutarse desde la raíz en la mayoría de los casos.
- La gestión de dependencias y builds se vuelve más sofisticada (pero más poderosa).

## 2. Estructura Actual (2026)

```
ServSoftBagm/
├── apps/
│   ├── apps/server/                 → Backend (Express + PostgreSQL/SQLite)
│   └── apps/client/                 → Frontend (React + Vite + Tailwind)
├── packages/                   → (Futuro) Código compartido
├── turbo.json                  → Configuración de tareas y caché
├── package.json (raíz)         → Workspaces + scripts de Turborepo
└── docs/                       → Documentación y guías de estudio
```

## 3. Principios Aplicados

- **Clean Architecture / Hexagonal** en el código (ver `apps/apps/server/services/`).
- **Separación de concerns** a nivel de proyecto (monorepo).
- **Developer Experience (DX)** profesional: comandos simples desde la raíz.
- **Documentación como código**: Decisiones registradas en `docs/decisions/` y guías de estudio.

## 4. Flujo de Trabajo Recomendado

```bash
# Desde la raíz
npm run dev          # Levanta todo con Turborepo
npm run build
npm run lint

# Comandos específicos
npm run dev:server
npm run dev:client
```

## 5. Lecciones Clave del Proceso

1. Turborepo v2 cambió `pipeline` por `tasks`.
2. Es obligatorio declarar `packageManager` cuando se usan workspaces.
3. Mover carpetas mientras los servidores están corriendo causa bloqueos (matar procesos Node es necesario).
4. Las migraciones de esquema de base de datos deben ser explícitas (`ALTER TABLE IF NOT EXISTS`).

## 6. Documentos Relacionados

- `docs/MONOREPO_MIGRATION.md` — Registro detallado de la migración.
- `docs/decisions/` — Architecture Decision Records (ADRs).
- `DEVELOPMENT.md` — Guía práctica de desarrollo.
- `docs/security/REPOSITORY_SECURITY_GIT_HYGIENE_AND_PRE_COMMIT_CHECKLIST.md`

---

**Este proyecto evolucionó de un setup simple de dos carpetas a un monorepo profesional con Turborepo**, cumpliendo con el objetivo de "Nivel 3 - Full profesional" solicitado por el dueño del proyecto.