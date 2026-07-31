# Principios de Arquitectura - ServSoftBagm (Nivel 3)

## 1. Visión General

ServSoftBagm sigue un enfoque de **Arquitectura Limpia (Clean Architecture)** combinado con **Hexagonal Architecture (Ports & Adapters)** a nivel de backend, sobre una base de **Monorepo profesional con Turborepo**.

El objetivo es lograr:
- Alta mantenibilidad
- Facilidad para cambiar tecnologías (DB, frameworks, proveedores de IA, etc.)
- Separación clara de responsabilidades
- Testabilidad
- Escalabilidad hacia microservicios si fuera necesario

## 2. Estructura Actual del Monorepo

```
ServSoftBagm/
├── apps/
│   ├── apps/server/                 → Backend (Node.js + Express)
│   └── apps/client/                 → Frontend (React + Vite)
├── packages/                   → (Futuro) Código compartido
├── turbo.json
└── package.json (raíz)
```

### Reglas de Dependencias (Clean Architecture)

- `apps/server` no debe depender de `apps/client`.
- Dentro de `apps/server`, el **núcleo** (dominio + aplicación) **no debe depender** de frameworks externos (Express, base de datos específica, etc.).
- Las dependencias apuntan hacia adentro (hacia el dominio).

## 3. Patrones de Arquitectura Adoptados

### 3.1 Clean Architecture / Hexagonal

**Capas principales (planeadas para apps/server):**

- **Domain** (`domain/`): Entidades, Value Objects, Domain Events, Reglas de negocio puras.
- **Application** (`application/`): Casos de uso (Use Cases), DTOs de entrada/salida, puertos (interfaces).
- **Infrastructure** (`infrastructure/`): Implementaciones concretas (Repositorios con Prisma/Sequelize/TypeORM, adaptadores de WhatsApp, Make.com, IA, etc.).
- **Interfaces / Adapters** (`interfaces/` o `adapters/`): Controladores HTTP, rutas Express, DTOs de API.

**Regla de oro:**
> El código en `domain` y `application` **no puede importar** nada de `infrastructure` o frameworks externos.

### 3.2 Ports & Adapters (Hexagonal)

- **Ports**: Interfaces definidas en la capa de Application (ej: `ILeadRepository`, `IWhatsAppSender`, `IAnalyticsEngine`).
- **Adapters**: Implementaciones concretas en Infrastructure que "enchufan" el mundo exterior al núcleo.

Ejemplos planeados:
- `ILeadRepository` → Implementado por `PostgresLeadRepository` y `SQLiteLeadRepository`.
- `INotificationService` → Implementado por `MakeComWhatsAppAdapter` y `ConsoleNotificationAdapter`.

### 3.3 Repository Pattern

Usaremos Repositories para abstraer el acceso a datos. Esto permite cambiar de base de datos sin tocar la lógica de negocio.

### 3.4 Dependency Inversion Principle (DIP)

Las capas internas definen las interfaces. Las capas externas las implementan.

## 4. Patrones de Diseño que se están / se usarán

- **Repository Pattern** (acceso a datos)
- **Use Case / Command Pattern** (lógica de aplicación)
- **Factory** (creación de adaptadores según entorno)
- **Strategy** (diferentes estrategias de notificación: WhatsApp, Email, Console)
- **Adapter** (adaptadores para diferentes proveedores de IA, WhatsApp, etc.)
- **DTO** (Data Transfer Objects) para comunicación entre capas
- **Value Object** (en Domain)

## 5. Patrones de Mensajería

Actualmente el sistema usa principalmente **sincronía** (HTTP requests).

### Estrategia recomendada a futuro:

| Tipo de comunicación       | Patrón recomendado       | Ejemplo de uso                          | Tecnología sugerida |
|---------------------------|--------------------------|-----------------------------------------|---------------------|
| Síncrona (request/response) | Request/Response        | Crear lead, obtener datos de cliente    | REST / tRPC        |
| Asíncrona (eventos)        | Event-Driven            | "Lead creado", "Factura pagada", "OTP enviado" | RabbitMQ / NATS / Redis Streams |
| Notificaciones externas    | Outbox + Adapter        | Envío de WhatsApp / Email               | Make.com / n8n + Outbox Pattern |

**Decisión actual (2026):**
- Mantener comunicación síncrona por HTTP mientras el sistema es pequeño.
- Introducir mensajería asíncrona (Event-Driven) cuando aparezcan necesidades de:
  - Notificaciones en tiempo real
  - Procesos largos (generación de reportes)
  - Integraciones con terceros (Make.com, n8n, IA externa)

## 6. Decisiones Arquitectónicas Clave

- **Monorepo con Turborepo**: Elegido por productividad y consistencia de herramientas.
- **Separación apps/server y apps/client**: Claridad de responsabilidades y despliegue independiente.
- **Clean + Hexagonal en backend**: Elegido para proteger la lógica de negocio y permitir cambios tecnológicos.
- **No microservicios por ahora**: Se mantiene como monolito modular hasta que el dominio lo justifique.

---

Este documento debe ser actualizado cada vez que se tome una decisión arquitectónica importante.

**Próximos documentos recomendados:**
- `DOMAIN_MODEL.md` (modelo de dominio)
- `USE_CASE_CATALOG.md`
- `ADAPTERS_AND_PORTS.md`
- `EVENTS_CATALOG.md` (cuando introduzcamos mensajería)