# Proceso: Intake de Cliente (Chatbot → WhatsApp)

**Proyecto:** ServSoftBagm  
**Fecha:** 2026-05-30

---

## Diagrama de Flujo (Swimlane)

```mermaid
sequenceDiagram
    autonumber
    participant Cliente
    participant ChatbotWeb
    participant Backend
    participant Make.com
    participant WhatsApp
    participant Admin

    Cliente->>ChatbotWeb: Abre chatbot y selecciona servicio
    ChatbotWeb->>Cliente: Pide Nombre
    Cliente->>ChatbotWeb: Envía nombre
    ChatbotWeb->>Cliente: Pide Teléfono / Cédula
    Cliente->>ChatbotWeb: Envía teléfono
    ChatbotWeb->>Cliente: Pide Dirección
    Cliente->>ChatbotWeb: Envía dirección
    ChatbotWeb->>Cliente: Pide descripción del caso
    Cliente->>ChatbotWeb: Envía requerimiento

    ChatbotWeb->>Backend: POST /api/leads (datos estructurados)
    Backend->>Backend: Genera ticket + OTP + guarda en BD
    Backend->>Make.com: Webhook con datos + OTP
    Make.com->>WhatsApp: Envía mensaje con código OTP
    WhatsApp->>Cliente: Recibe código por WhatsApp

    ChatbotWeb->>Cliente: Muestra resumen + abre WhatsApp con mensaje estructurado
    Cliente->>WhatsApp: Confirma o responde

    Admin->>WhatsApp: Recibe notificación estructurada
    Admin->>Dashboard: Registra / actualiza lead manualmente
```

---

## Descripción del Proceso

1. El cliente interactúa con el Chatbot web.
2. Se recolectan datos de forma guiada y validada.
3. El backend genera un **ticket** y un **OTP**.
4. El OTP se envía por WhatsApp (a través de Make.com).
5. El cliente recibe un mensaje estructurado por WhatsApp con toda su información.
6. El administrador recibe la notificación y puede registrar el lead en el sistema.

---

## Notas de Implementación

- Todo el flujo está diseñado para ser **100% gratis** durante la fase de validación.
- El backend no envía WhatsApp directamente (para mantenerlo simple y barato). Usa Make.com como capa de mensajería.

**Recomendación:** Mantener este diagrama actualizado cada vez que cambie el flujo de intake del cliente.
