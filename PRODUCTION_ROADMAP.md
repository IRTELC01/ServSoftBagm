# 🚀 PLAN DE TRABAJO COMPLETO Y AUTOMATIZADO
## ServSoftBagm — De MVP a Producción

**Versión:** 1.0  
**Fecha:** Enero 2026  
**Enfoque:** Automatización máxima usando GitHub Actions, scripts reutilizables y pipelines verificables.

---

## Principios del Plan

1. **Automatización primero**: Todo lo que se pueda scriptar o poner en CI se hace.
2. **Seguridad por defecto**: Ningún paso avanza si hay vulnerabilidades HIGH/CRITICAL.
3. **Calidad obligatoria**: No se mergea código sin tests que pasen.
4. **Entregas incrementales**: Cada fase produce valor usable.
5. **Windows + Cross-platform**: Mantener compatibilidad con los scripts .ps1 existentes + agregar bash/sh para Linux/CI.

---

## Fases del Roadmap (Ordenadas por Prioridad)

| Fase | Nombre | Duración Estimada | Bloquea Producción | Automatización |
|------|--------|-------------------|--------------------|----------------|
| **0** | Estabilización y Auditoría | 1-2 días | No | Scripts + GitHub Issue templates |
| **1** | Hardening de Seguridad Crítica | 4-6 días | **SÍ** | npm audit + Dependabot + Policy as Code |
| **2** | Facturas Profesionales (PDF) + Reportes | 5-7 días | **SÍ** | Script de generación + tests |
| **3** | Testing + CI/CD Foundation | 4-5 días | **SÍ** | GitHub Actions completo |
| **4** | Despliegue de Producción Real | 3-4 días | **SÍ** | Docker multi-stage + Render/ Railway / VPS pipeline |
| **5** | Observabilidad, Backups y Ops | 3 días | Parcial | Healthchecks + Backups automatizados |
| **6** | Mejoras de Negocio (CRM, Leads, Analytics) | 6-8 días | No | Feature flags |
| **7** | WhatsApp Avanzado + Persistencia | 4 días | No | DB-backed sessions |
| **8** | Go-Live, Legal y Monitoreo Continuo | 2-3 días | - | Post-deploy checks automatizados |

**Tiempo total estimado (equipo de 1-2 personas dedicadas):** 6-9 semanas.

---

## FASE 0: Estabilización y Auditoría (Actual)

**Objetivo:** Dejar el repositorio en estado "conocido y limpio".

### Tareas

- [x] Auditoría completa (este documento + ANALYSIS.md).
- [ ] Crear `.github/ISSUE_TEMPLATE/` y `PULL_REQUEST_TEMPLATE.md`.
- [ ] Añadir `.gitignore` mejoras (node_modules ya está, pero asegurar `client/dist`, `.env*`, `*.db`, `security/*.log`).
- [ ] Ejecutar `npm audit fix` donde sea seguro + documentar excepciones.
- [ ] Mover `client/dist` a `.gitignore` y eliminar del repo (commit de limpieza).
- [ ] Actualizar `server/.env.example` con advertencias fuertes sobre MASTER_PASSWORD.
- [ ] Crear script `scripts/audit-security.ps1` y `scripts/audit-security.sh`.

### Automatización

Crear `.github/workflows/audit.yml` (ejecuta en push a main y PRs):

```yaml
name: Security & Dependency Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci --prefix server
      - run: npm audit --prefix server --audit-level=high
```

**Criterio de salida:** Repositorio limpio + primer workflow corriendo verde.

---

## FASE 1: Hardening de Seguridad Crítica (BLOQUEADOR)

### 1.1 Eliminar / Aislar Master Password (Máxima Prioridad)

**Opción recomendada (A):** Convertirlo en "Recovery Mode" que solo funciona si:
- `MASTER_ENABLE=true` **Y**
- Existe un archivo físico `/security/RECOVERY_ENABLED` en el servidor (o variable de entorno especial).
- Envía alerta inmediata + deshabilita el modo después de un uso.

**Opción B (más segura):** Eliminar completamente la funcionalidad de master password en producción (solo dejarla en desarrollo).

**Entregable:** PR con cambios en `server/routes/auth.js`.

### 1.2 Resolver Vulnerabilidades

```bash
# En server/
npm audit
npm audit fix --force   # donde sea seguro
```

**Paquetes problemáticos conocidos:**
- `express-rate-limit` → actualizar
- `path-to-regexp` (Express 5 dependency indirecta)
- `nodemailer`
- `jws`

Si no se puede actualizar sin romper, añadir **Snyk** o **Dependabot** con excepciones justificadas.

### 1.3 Mejoras de Auth

- [ ] Añadir **refresh tokens** (JWT corto + refresh largo con rotación).
- [ ] Implementar **token blacklist** simple (Redis o tabla `revoked_tokens`).
- [ ] Reducir expiry de access token a 15-30 minutos.
- [ ] Añadir rate limit **por usuario** en rutas sensibles (`/login`, `/change-password`).
- [ ] Validación estricta de entrada con **Zod** (nueva dependencia recomendada).

### 1.4 Otras

- Quitar `OPEN_ACCESS` de producción (solo permitir en `NODE_ENV=development`).
- Añadir `helmet` para headers de seguridad.
- Sanitizar inputs en notas de factura (evitar XSS si se renderiza en frontend).

**Automatización:**
- GitHub Action que falla el build si `npm audit --audit-level=high` detecta problemas.
- Policy: "No se mergea PR con vulnerabilidades HIGH".

**Criterio de salida Fase 1:** `npm audit --audit-level=high` limpio + master password aislado + PR de hardening aprobado.

---

## FASE 2: Facturas Profesionales + Reportes (BLOQUEADOR)

Este es el **feature más importante** para que el negocio pueda usar el sistema realmente.

### 2.1 Generación de PDF de Factura

**Recomendación técnica:**

**Opción A (recomendada):** Backend con **pdfkit** o **puppeteer** (HTML → PDF con plantilla bonita).
- Ventaja: Control total, branding consistente.
- Desventaja: Puppeteer es pesado.

**Opción B:** Frontend con **@react-pdf/renderer** (genera PDF en el navegador).
- Más simple de implementar inicialmente.

**Entregable mínimo:**
- Botón "Descargar PDF" en cada factura del Dashboard.
- Plantilla con:
  - Logo de ServSoftBagm
  - Datos de la empresa (dirección, teléfonos, NIT si aplica)
  - Datos del cliente
  - Tabla de ítems + totales
  - Número de factura con formato legal (0000-XXXX)
  - Fecha, método de pago, notas
  - Pie con "Documento interno - no válido para efectos fiscales DIAN" (importante)

### 2.2 Mejoras en Facturas

- [ ] Endpoint `PUT /api/invoices/:id` (edición).
- [ ] Endpoint `POST /api/invoices/:id/cancel` (anulación con motivo).
- [ ] Paginación (`?page=1&limit=20`) + filtros por fecha, cliente, método de pago.
- [ ] Búsqueda full-text.

### 2.3 Reportes y Exportación

- Exportar resumen contable a **Excel** (xlsx) usando `xlsx` o `exceljs`.
- Reporte mensual automático (script que se puede correr localmente).
- Gráficos básicos en Dashboard (usar Recharts o Chart.js).

**Automatización:**
- Script `scripts/generate-invoice-pdf.js` (puede correr standalone).
- Tests que validan que el PDF se genera sin errores y contiene datos clave.

**Criterio de salida Fase 2:** Usuario puede generar PDF profesional de cualquier factura desde el Dashboard. Listado de facturas paginado y filtrable.

---

## FASE 3: Testing + CI/CD Foundation (BLOQUEADOR)

### 3.1 Testing Strategy

| Tipo | Herramienta | Cobertura objetivo | Ubicación |
|------|-------------|--------------------|---------|
| Unit (backend) | Jest + Supertest | Rutas críticas (auth, invoices) | `server/__tests__/` |
| Integration | Jest | Flujo completo factura + accounting | `server/__tests__/integration` |
| E2E (frontend) | Playwright | Login → crear factura → ver resumen | `client/e2e/` |
| Component | React Testing Library | Formularios clave | `client/src/**/*.test.jsx` |

### 3.2 CI Pipeline (`.github/workflows/ci.yml`)

Flujo obligatorio en todo PR:

1. Checkout + setup Node 20
2. `npm ci` server + client
3. Lint (ESLint)
4. **Security audit** (falla si hay HIGH)
5. Tests backend
6. Tests frontend (si existen)
7. Build client
8. (Opcional) Build Docker images

**Ejemplo de matriz:** Probar con SQLite y PostgreSQL.

### 3.3 CD Pipeline (`.github/workflows/deploy.yml`)

- Solo en `main` (o tags `v*`).
- Deploy condicional según secrets configurados:
  - Si existe `RENDER_API_KEY` → deploy a Render.
  - Si existe `FLY_TOKEN` o `RAILWAY_TOKEN` → deploy alternativo.
- Health check post-deploy.

**Criterio de salida Fase 3:** 
- Al menos 15 tests pasando (backend + frontend).
- Todo PR debe pasar el workflow CI completo.
- Primer deploy automático a un entorno de staging.

---

## FASE 4: Despliegue de Producción Real

### 4.1 Dockerfiles de Producción

**Backend (`server/Dockerfile.prod`):**
- `node:20-alpine`
- Multi-stage: install deps → build → runtime solo producción
- No exponer puertos innecesarios
- Usuario no-root

**Frontend:**
- Build stage (node) → Nginx Alpine stage sirviendo `dist` + headers de seguridad.

**docker-compose.prod.yml** separado del de desarrollo.

### 4.2 Opciones de Hosting Recomendadas (2026)

| Plataforma | Ventajas | Costo aprox | Recomendado para |
|------------|----------|-------------|------------------|
| **Render** | Fácil, ya configurado | Free → $7/mes | MVP / Staging |
| **Railway** | Excelente DX, DB incluida | ~$5-20/mes | Recomendado |
| **Fly.io** | Global, barato, Docker native | Muy barato | Producción real |
| **VPS (Hetzner/DigitalOcean)** + Coolify | Control total + backups | ~$6-15/mes | Cuando haya ingresos |

**Acción inmediata:** Corregir `render.yaml` (el problema de interpolación de `publicHost`).

### 4.3 Variables de Entorno de Producción (Checklist)

```env
NODE_ENV=production
JWT_SECRET=<generado aleatoriamente 64+ chars>
DB_DRIVER=pg
DATABASE_URL=<supabase/railway/neon/etc>
FRONTEND_ORIGIN=https://app.servsoftbagm.com
WHATSAPP_* (si se usa)
MASTER_ENABLE=false
RESET_ADMIN_PASSWORD_ON_START=false
SENTRY_DSN=...
```

**Automatización:** Script `scripts/setup-production-env.sh` que genera secretos y valida que no queden valores por defecto.

**Criterio de salida Fase 4:** Aplicación corriendo en un entorno real (staging o prod) con Docker, accesible por HTTPS, sin vulnerabilidades conocidas.

---

## FASE 5: Observabilidad, Backups y Operaciones

### 5.1 Logging Estructurado

- Reemplazar `console.log` por **pino** (recomendado) o winston.
- Añadir request ID en todos los logs.
- Logs de auditoría (quién creó factura, quién inició sesión, etc.).

### 5.2 Monitoreo

- **Health endpoints mejorados:**
  - `GET /health` → DB connectivity + WhatsApp config status.
  - `GET /ready` para Kubernetes/Render.
- Integrar **Sentry** (frontend + backend) o **Axiom** / **BetterStack**.
- Uptime monitoring (UptimeRobot o similar, gratis).

### 5.3 Backups Automatizados

**Script `scripts/backup-db.sh`** (cron o GitHub Action scheduled):

- PostgreSQL: `pg_dump` → comprimir → subir a S3 / Google Drive / Dropbox / Hetzner Storage.
- Retención: 30 días diarios + 12 meses mensuales.
- Alerta si el backup falla (email + WhatsApp si es posible).

**Para SQLite:** Copia simple del archivo `.db` + WAL.

### 5.4 Alertas

- Uso de master password.
- Múltiples intentos fallidos de login.
- Facturas con total > X (regla de negocio configurable).

**Criterio de salida Fase 5:** Tienes visibilidad de que el sistema está vivo, y backups que se ejecutan automáticamente.

---

## FASE 6: Mejoras de Negocio de Alto Valor

- **Módulo de Leads / Cotizaciones:**
  - Formulario público "Solicitar cotización".
  - El chatbot de WhatsApp crea registros en tabla `leads`.
  - Dashboard muestra leads pendientes.

- **CRM mínimo:**
  - Tabla `customers` (nombre, teléfono, dirección, historial de facturas).
  - Autocompletar cliente en factura.

- **Dashboard de KPIs:**
  - Ingresos últimos 30/90 días.
  - Top 5 clientes.
  - Margen promedio por servicio.
  - Utilidad neta (usando accounting).

- **Gestión básica de inventario** (si aplica al negocio):
  - Tabla `inventory_items`.
  - Descontar stock al crear factura (opcional).

**Feature flags** usando variable de entorno o tabla simple `feature_flags`.

---

## FASE 7: WhatsApp Avanzado

- Persistir sesiones en DB (`whatsapp_sessions` tabla).
- Guardar historial completo de conversaciones.
- Crear lead/ticket automáticamente al terminar un flujo.
- Integrar con un "catálogo" de respuestas frecuentes (FAQ dinámico en DB).
- Soporte para mensajes multimedia (imágenes de evidencia de soporte).

---

## FASE 8: Go-Live, Legal y Cierre

### Checklist Final de Producción

- [ ] Dominio propio + SSL (Cloudflare o Let's Encrypt).
- [ ] Política de privacidad + Términos de servicio (mínimos, generados con herramienta).
- [ ] Aviso legal sobre "facturación interna" vs DIAN.
- [ ] Backup verificado + restore de prueba.
- [ ] Runbook de emergencia (`docs/INCIDENT_RESPONSE.md`).
- [ ] Credenciales de admin rotadas (no usar defaults).
- [ ] 2FA activado en la cuenta admin real.
- [ ] Monitoreo + alertas configuradas.
- [ ] Primera factura real generada y PDF enviado a cliente de prueba.

### Post-Lanzamiento (Automatizado)

- GitHub Action mensual: "Production Health Check" (corre tests de humo contra prod).
- Renovación de dependencias automatizada (Renovate o Dependabot).
- Revisión trimestral de vulnerabilidades.

---

## Herramientas y Dependencias Nuevas Recomendadas

| Propósito | Paquete | Fase |
|-----------|---------|------|
| Validación | zod | 1 |
| PDF | pdfkit o @react-pdf/renderer | 2 |
| Excel | xlsx | 2 |
| Tests backend | jest, supertest | 3 |
| E2E | @playwright/test | 3 |
| Logging | pino | 5 |
| Monitoreo | @sentry/node + @sentry/react | 5 |
| HTTP security | helmet | 1 |
| Charts | recharts | 2 |

---

## Estructura de Automatización Propuesta

```
.github/
  workflows/
    ci.yml                 # PRs obligatorios
    deploy-staging.yml
    deploy-production.yml
    security-audit.yml
    scheduled-backup.yml   # cron
    production-health.yml  # mensual
scripts/
  backup-db.sh
  generate-invoice-pdf.js
  setup-production-env.sh
  audit-security.ps1 / .sh
  smoke-test.js
docs/
  RUNBOOK.md
  SECURITY.md
  DEPLOYMENT.md
```

---

## Métricas de Éxito

| Indicador | Antes (Actual) | Meta Fase 4 | Meta Fase 8 |
|-----------|----------------|-------------|-------------|
| Vulnerabilidades HIGH | 6+ | 0 | 0 + Renovación automatizada |
| Cobertura de tests | 0% | >40% | >70% |
| Tiempo de deploy | Manual | < 5 min | < 3 min con rollback |
| Generación de factura profesional | .txt manual | PDF 1-click | PDF + envío WhatsApp automático |
| Tiempo de recuperación ante desastre | Desconocido | < 1 hora | < 15 min (backups probados) |
| Incidentes de seguridad reportados | - | 0 | 0 |

---

## Recomendaciones de Ejecución

1. **No intentes hacer todo de una vez.** Empieza por **Fase 1 + Fase 2** (seguridad + PDF). Eso ya te da un sistema usable internamente.
2. Usa **worktrees** o ramas `feat/phase-1-security` para aislar el trabajo.
3. Cada fase debe terminar con un **release tag** (`v0.2-security`, `v0.3-pdf-invoices`, etc.).
4. Revisa semanalmente este roadmap y actualízalo.

---

## Próximos Pasos Inmediatos (Esta Semana)

1. Leer `ANALYSIS.md` completo.
2. Crear branch `feat/phase-0-stabilization`.
3. Implementar el workflow de Security Audit (Fase 0).
4. Decidir estrategia del Master Password (eliminar o aislar fuertemente).
5. Instalar `zod` y empezar validación en rutas críticas.

---

**Este documento es vivo.** Actualízalo conforme avances. Cada fase completada debe tener su propia sección de "Lecciones aprendidas".

---

*Plan generado tras auditoría profunda del repositorio Clone_ServSoftBagm.*