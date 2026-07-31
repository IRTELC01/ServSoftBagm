# Flujo Completo del Cliente (Lead → Ticket → Portal → Facturación)

## Visión General (Objetivo)

Cuando un cliente contacta a ServSoftBagm (por WhatsApp o formulario), queremos que:

1. Se cree un **Lead** con un **Ticket** único.
2. El cliente reciba ese Ticket de forma clara.
3. El cliente pueda entrar al **Portal del Cliente** con Teléfono + Ticket.
4. Reciba un código OTP (preferiblemente por WhatsApp).
5. Vea:
   - Estado de su equipo / servicio
   - Fotos del diagnóstico
   - Información de facturación / pago (QR + datos bancarios)
   - Posibilidad de pagar por transferencia

Este flujo debe ser **profesional, trazable y fácil de usar** tanto para el cliente como para el administrador.

---

## Estado Actual (Mayo 2026)

### Lo que funciona:
- Creación de Leads (chatbot + registro manual en Dashboard).
- Generación automática de Ticket (`TKT-...`).
- ClientPortal con flujo Phone + Ticket → OTP → Ver datos básicos del lead.
- Sección de Datos Bancarios en el Dashboard (configurada en `apps/client/src/config/bank.ts`).
- Generación de facturas e invoices.
- Autenticación admin con 2FA.

### Lo que **NO** funciona bien todavía (crítico):

1. **Entrega del Ticket al cliente** (especialmente en leads manuales).
2. **Integración Lead ↔ Facturación** (el cliente no ve su factura o monto a pagar desde el portal).
3. **Envío real del OTP por WhatsApp** (actualmente depende de Make.com; en desarrollo solo sale en consola).
4. **Visualización de información de pago** dentro del ClientPortal (QR + datos bancarios).
5. **Flujo completo "Lead → Factura → Pago"** trazable.

---

## Flujo Ideal Propuesto (Clean Flow)

### Paso 1: Creación del Lead
- **Origen**: Chatbot (público) o Registro manual (admin).
- **Resultado**: Lead guardado + `ticket_number` generado.
- **Entrega del Ticket**:
  - **Chatbot**: El bot debe responder inmediatamente con el ticket y explicar cómo usarlo en el portal.
  - **Manual (Admin)**: El administrador debe tener una forma fácil de "Enviar Ticket al Cliente" (copiar mensaje listo para WhatsApp, o futuro envío automático).

### Paso 2: Acceso del Cliente
- Cliente va al Portal del Cliente.
- Ingresa Teléfono + Ticket.
- Recibe OTP (idealmente por WhatsApp vía Make.com).
- Ingresa OTP → Accede a su información.

### Paso 3: Vista del Cliente (después de OTP)
Debe ver claramente:
- Estado actual del servicio (Recibido, En diagnóstico, Reparado, Listo para entrega, etc.)
- Fotos del equipo / diagnóstico
- Descripción del problema
- **Información de pago**:
  - Monto total (si ya se generó factura)
  - Datos bancarios + QR para transferencia
  - Historial de facturas asociadas a este ticket (futuro)

### Paso 4: Pago y Cierre
- Cliente paga por transferencia usando los datos/QR.
- Admin marca el lead como pagado / finalizado.
- (Futuro) Posibilidad de subir comprobante de pago.

---

## Acciones Prioritarias Recomendadas

### Alta Prioridad (Próximas iteraciones)

1. **Mejorar entrega de Ticket en registro manual**
   - Después de registrar un lead manual, mostrar claramente el Ticket generado.
   - Botón "Copiar mensaje para WhatsApp" con texto profesional listo para enviar al cliente.

2. **Integrar Datos de Pago en ClientPortal**
   - Mostrar la sección de "Datos para Transferencia" (del config/bank.ts) dentro del portal del cliente después del OTP.
   - Idealmente, permitir asociar una factura al lead.

3. **Mejorar visibilidad del OTP en desarrollo**
   - Actualmente sale en `alert`. Mejorarlo para que sea más obvio en la interfaz del ClientPortal.

4. **Vincular Leads con Facturas**
   - Permitir (desde el Dashboard) generar una factura asociada a un lead específico.
   - Que el cliente pueda verla desde su portal.

### Media Prioridad

- Configurar Make.com para envío real de OTP por WhatsApp (ya hay código preparado).
- Agregar historial de estados del lead (timeline).
- Permitir que el cliente suba fotos o comentarios adicionales.

---

## Recomendación de Arquitectura (para mantener limpia)

- Mantener la lógica de Leads en `apps/server/routes/leads.js` + futuros servicios.
- Crear un servicio dedicado `LeadService` y `InvoiceService` cuando avancemos hacia hexagonal.
- El ClientPortal debe consumir endpoints protegidos por OTP (no por JWT de admin).
- Los datos bancarios deben venir de una fuente central (`apps/client/src/config/bank.ts` o un endpoint dedicado).

---

**Este documento debe servir como referencia para todas las siguientes iteraciones relacionadas con el flujo del cliente.**

¿Quieres que empecemos implementando el punto #1 (mejor entrega de ticket + botón de copiar mensaje para WhatsApp) como primera tarea concreta? O prefieres que primero documentemos más patrones de arquitectura antes de tocar código.