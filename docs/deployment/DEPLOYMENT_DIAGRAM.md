# Deployment Diagram

**Proyecto:** ServSoftBagm  
**Fecha:** 2026-05-30

---

## Arquitectura de Despliegue Actual (Fase de Validación)

```mermaid
graph TD
    subgraph "Cliente (Navegador)"
        A[Cliente Final]
        B[Admin / Dueño]
    end

    subgraph "Render.com (Free Tier)"
        C[Frontend React<br/>Vite]
        D[Backend Node.js + Express]
    end

    subgraph "Render PostgreSQL<br/>(o Docker local)"
        E[(Base de Datos<br/>PostgreSQL / SQLite)]
    end

    subgraph "Make.com (Free Tier)"
        F[Automatizaciones<br/>WhatsApp + Webhooks]
    end

    subgraph "WhatsApp Cloud API"
        G[WhatsApp Business]
    end

    A -->|Consulta estado| C
    B -->|Gestiona todo| C
    C -->|Llama APIs| D
    D -->|Lee/Escribe| E
    D -->|Dispara webhooks| F
    F -->|Envía mensajes| G
    G -->|Recibe respuestas| A
```

---

## Componentes

| Componente          | Dónde está                  | Notas |
|---------------------|-----------------------------|-------|
| Frontend React      | Render (Static Site)        | Sirve la SPA |
| Backend Node.js     | Render (Web Service)        | API principal |
| Base de datos       | PostgreSQL (Render o Docker local) | Actualmente SQLite en local |
| Automatización      | Make.com                    | Gratuito hasta 1000 operaciones |
| Comunicación        | WhatsApp Cloud API          | Gratuito hasta 1000 conversaciones |

---

## Limitaciones Actuales del Despliegue

- Render Free Tier duerme los servicios después de 15 minutos de inactividad.
- No hay workers persistentes fácilmente.
- Make.com tiene límite de operaciones.
- No hay colas de mensajes reales.

---

## Arquitectura de Despliegue Objetivo (Cuando haya presupuesto)

```mermaid
graph TD
    subgraph "Cliente"
        A[Cliente]
        B[Admin]
    end

    subgraph "Cloud / VPS"
        C[Frontend - Vercel/Netlify]
        D[Backend Node.js - Railway / VPS]
        E[PostgreSQL - Railway / Supabase]
        F[n8n - Self-hosted]
    end

    subgraph "WhatsApp"
        G[Evolution API o WhatsApp Cloud]
    end

    A --> C
    B --> D
    D --> E
    D --> F
    F --> G
    G --> A
```

---

**Este documento debe actualizarse cada vez que cambie la infraestructura de despliegue.**
