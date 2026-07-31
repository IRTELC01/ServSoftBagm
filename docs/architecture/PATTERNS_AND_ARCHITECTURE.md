# Patrones de Diseño y Arquitectura - ServSoftBagm

**Versión**: 1.0  
**Fecha**: 2026  
**Estado**: En evolución (Monorepo + preparación para Hexagonal)

## 1. Patrones de Arquitectura Adoptados

### 1.1 Monorepo con Turborepo (Nivel de Proyecto)

**Patrón**: Monorepo + Task Orchestration

- **Por qué**: Permite compartir herramientas, tipos, configuraciones y pipelines entre frontend y backend.
- **Implementación actual**:
  - `apps/server` y `apps/client` como aplicaciones independientes.
  - Turborepo para orquestación de tareas (`dev`, `build`, `lint`).
  - npm Workspaces para gestión de dependencias.

**Beneficios**:
- Un solo comando para desarrollar todo (`npm run dev`).
- Caché de tareas.
- Fácil escalar hacia `packages/` compartidos.

### 1.2 Clean Architecture + Hexagonal (en progreso)

**Objetivo**: Proteger la lógica de negocio del backend de cambios tecnológicos.

**Capas planeadas para `apps/server`**:

| Capa              | Ubicación propuesta     | Responsabilidad                              | Dependencias |
|-------------------|-------------------------|----------------------------------------------|--------------|
| **Domain**        | `domain/`               | Entidades, Value Objects, Reglas de negocio  | Ninguna      |
| **Application**   | `application/`          | Casos de uso, Puertos (Interfaces)           | Solo Domain  |
| **Infrastructure**| `infrastructure/`       | Repositorios, Adaptadores externos           | Application + Domain |
| **Interfaces**    | `interfaces/` o `routes/` | Controladores HTTP, DTOs, Presentación     | Application  |

**Regla estricta**:
> El código en `domain` y `application` **no puede importar** Express, base de datos, ni ningún framework.

### 1.3 Repository Pattern

Se utilizará para abstraer el acceso a datos.

Ejemplos futuros:
- `ILeadRepository`
- `IInvoiceRepository`
- `IUserRepository`

Implementaciones:
- `PostgresLeadRepository`
- `SQLiteLeadRepository` (para desarrollo local rápido)

### 1.4 Adapter Pattern (para integraciones externas)

Usado para aislar proveedores externos:

- WhatsApp (Make.com / Evolution API / WhatsApp Cloud)
- Proveedores de IA (OpenAI, Grok, Claude, modelo local)
- Pasarelas de pago (futuro)

Esto permite cambiar de proveedor sin tocar la lógica de negocio.

## 2. Patrones de Diseño

| Patrón              | Uso actual / planeado                          | Ubicación                  |
|---------------------|------------------------------------------------|----------------------------|
| **Repository**      | Acceso a datos                                 | `infrastructure/repositories` |
| **Use Case**        | Lógica de aplicación                           | `application/use-cases`    |
| **Factory**         | Creación de adaptadores según entorno          | `infrastructure/factories` |
| **Strategy**        | Diferentes formas de notificar (WhatsApp, Email, Console) | `infrastructure/notifications` |
| **Adapter**         | Adaptadores para IA, WhatsApp, etc.            | `infrastructure/adapters`  |
| **DTO**             | Transferencia de datos entre capas             | `application/dtos`         |
| **Value Object**    | Objetos inmutables con validación (ej: TicketNumber, Phone) | `domain/value-objects` |

## 3. Patrones de Mensajería (Actual y Futuro)

### Situación Actual (2026)

- Mayormente **síncrona** (HTTP REST).
- Notificaciones externas manejadas a través de **Make.com** (webhooks).
- OTPs y notificaciones simples.

### Estrategia Recomendada a Futuro

| Tipo de Comunicación     | Patrón Recomendado      | Cuándo usarlo                              | Tecnología sugerida      |
|--------------------------|-------------------------|--------------------------------------------|--------------------------|
| Síncrona                 | Request/Response        | Operaciones que necesitan respuesta inmediata | REST / tRPC             |
| Eventos de dominio       | Event-Driven            | "LeadCreated", "InvoicePaid", "LeadStatusChanged" | NATS / RabbitMQ / Redis Streams |
| Notificaciones externas  | Outbox Pattern + Adapter| Envío confiable de WhatsApp / Email        | Make.com / n8n + Outbox |

**Decisión actual**:
Mantener comunicación mayoritariamente síncrona mientras el sistema es pequeño. Introducir mensajería asíncrona cuando aparezcan necesidades de:
- Notificaciones confiables
- Procesos largos en segundo plano
- Desacoplamiento fuerte entre módulos

## 4. Principios Arquitectónicos No Negociables

1. **El Dominio es Rey**: La lógica de negocio no depende de frameworks.
2. **Inversión de Dependencias**: Las capas internas definen las interfaces.
3. **Separación de Responsabilidades**: Cada capa tiene un único propósito.
4. **Testabilidad**: El núcleo debe poder probarse sin base de datos ni HTTP.
5. **Evolutividad**: Debe ser fácil cambiar de base de datos, proveedor de IA o forma de notificar.

---

**Este documento es la referencia oficial de patrones para ServSoftBagm mientras avanzamos hacia una arquitectura hexagonal más completa.**