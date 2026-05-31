# Guía de Uso del Panel de Administración - ServSoftBagm

**Versión:** 1.0  
**Fecha:** 2026-05-30  
**Dirigido a:** Administradores y Dueños del software

---

## 1. Acceso al Panel

### Credenciales por Defecto (Desarrollo)

- **Usuario**: `admin`
- **Contraseña**: `servsoft123` (configurable vía `DEFAULT_ADMIN_PASSWORD` en el backend)

**Importante**: Al vender el software, **cambia inmediatamente** esta contraseña y activa 2FA.

### Cómo Iniciar Sesión

1. Ingresa a `/login`
2. Escribe usuario y contraseña.
3. Si tienes 2FA activado, ingresa el código de 6 dígitos de tu aplicación autenticadora (Google Authenticator, Authy, etc.).

---

## 2. Secciones Principales del Dashboard

### Facturación Rápida
- Permite crear facturas de forma rápida.
- Incluye cálculo automático de IVA, subtotal y total.
- Al guardar, el lead/factura aparece automáticamente en la sección de Leads.

### Leads y Clientes
- Aquí se registran todos los contactos que llegan por WhatsApp o manualmente.
- Puedes:
  - Registrar nuevos leads manualmente.
  - Ver los que llegaron desde el Chatbot (con ticket, dirección, requerimiento, etc.).
  - Cambiar el estado (Pendiente → Contactado → Agendado → Finalizado).
  - Agregar fotos del equipo del cliente.
  - Copiar datos estructurados para usar en Make.com.

**Limpiar datos de prueba**:
- Botón "Limpiar datos de prueba" (solo visible en desarrollo).
- Úsalo cuando tengas muchos registros de prueba.

### Datos Bancarios para Transferencias
- Se muestra la información de tu cuenta bancaria.
- Incluye el QR para que los clientes puedan pagar fácilmente.

### Sección de Clientes y Seguimiento (en desarrollo)
- Espacio preparado para llevar historial completo por cliente y equipo.

---

## 3. Buenas Prácticas

- Después de cada factura creada, revisa la sección de Leads. Los datos aparecen automáticamente.
- Usa el botón "Actualizar" si no ves los cambios inmediatamente.
- Cuando un cliente te escriba por WhatsApp, registra el lead manualmente con su información para tener trazabilidad.

---

## 4. Cerrar Sesión

- Usa el botón **"Cerrar sesión"** (esquina superior derecha).
- Se recomienda cerrar sesión al terminar de usar el panel, especialmente si compartes la computadora.

**Nota**: Si tienes `OPEN_ACCESS=true` activado (solo para desarrollo), el cierre de sesión puede no ser estricto. En producción real debe funcionar correctamente.

---

## 5. Soporte

Cualquier duda o problema con el panel:
- Escríbenos al correo: servsoftbagm@gmail.com
- O por WhatsApp: 301 504 5982

---

**Este documento debe entregarse junto con el software cuando se venda a un nuevo cliente.**
