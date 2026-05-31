# Guía Maestra: Portal del Cliente + Autenticación y 2FA

**Proyecto:** ServSoftBagm  
**Versión del documento:** 1.0  
**Fecha:** 2026  
**Objetivo:** Documentar de forma clara y completa el sistema de acceso para clientes y administradores, incluyendo flujos, seguridad y cómo entregarlo cuando se venda el software.

---

## 1. Filosofía General de Acceso

ServSoftBagm maneja dos tipos de usuarios con necesidades muy diferentes:

- **Clientes finales** → Quieren consultar el estado de su servicio de forma **simple y sin fricción**.
- **Administradores / Dueños** → Necesitan acceso seguro al sistema completo (facturación, gestión de clientes, configuración, etc.).

Por eso se usan dos sistemas de autenticación diferentes:

| Tipo de Usuario     | Método de Acceso                          | Nivel de Seguridad | Experiencia de Usuario     |
|---------------------|-------------------------------------------|--------------------|----------------------------|
| Cliente             | Teléfono + Ticket + OTP por WhatsApp      | Media              | Muy simple y sin contraseña |
| Administrador       | Usuario + Contraseña + 2FA (App)          | Alta               | Seguro (estándar empresarial) |

---

## 2. Portal del Cliente (Flujo Actual y Recomendado)

### Flujo Actual (para desarrollo)

1. El cliente entra a `/cliente`
2. Ingresa:
   - Teléfono
   - Número de Ticket (ej: `TKT-17485932`)
3. El backend genera un código OTP de 6 dígitos.
4. Actualmente el código se muestra en la consola del servidor (para pruebas).
5. El cliente ingresa el código y accede al portal.

### Flujo Recomendado (Producción - 100% Gratis)

1. Cliente ingresa Teléfono + Ticket.
2. El sistema genera un OTP.
3. El OTP se envía **automáticamente por WhatsApp** al teléfono del cliente (usando Make.com + WhatsApp Cloud API).
4. El cliente recibe el código por WhatsApp.
5. Ingresa el código y accede.

**Ventajas:**
- Experiencia profesional.
- Totalmente gratis dentro de los límites de WhatsApp Cloud (1000 conversaciones/mes).
- Reduce fricción (el cliente ya usa WhatsApp).

### Cómo se conectará con Make.com (futuro inmediato)

Cuando configures Make.com:

- El backend (al generar el OTP) hará una petición HTTP a un **Webhook de Make.com**.
- Make.com recibirá: `phone`, `otp`, `ticket`, `client_name`.
- Make.com enviará un mensaje por WhatsApp con el código.

Ejemplo de mensaje que enviaría Make.com:

```
Hola [Nombre],

Tu código para consultar el estado de tu servicio es: **482917**

Ticket: TKT-17485932
Este código expira en 10 minutos.
```

---

## 3. 2FA para Administradores (Explicación Detallada)

### ¿Qué es el 2FA que usa ServSoftBagm?

Es **TOTP** (Time-based One-Time Password).

Este es el mismo sistema que usan casi todos los bancos, Google, Microsoft, etc.

**No es login con Google ni con Microsoft.**  
Es una aplicación que genera códigos en tu celular basados en un secreto que se comparte una sola vez.

### Cómo funciona cuando le vendes el software a alguien

#### Paso 1: Entrega inicial

Cuando vendas el sistema, le entregas al cliente:

- Usuario: `admin`
- Contraseña inicial: `servsoft123` (o la que hayas configurado en `DEFAULT_ADMIN_PASSWORD`)

#### Paso 2: Configuración obligatoria de 2FA

1. La persona entra por primera vez con usuario y contraseña.
2. El sistema le obliga (o le recomienda fuertemente) ir a la sección **"Configurar 2FA"**.
3. Se genera un **código QR** + una clave secreta.
4. La persona escanea ese QR con una de estas aplicaciones (todas gratis):

   - **Google Authenticator** (la más usada)
   - **Microsoft Authenticator**
   - **Authy** (recomendada si quiere respaldo en la nube)
   - **1Password** o **Bitwarden** (si ya usan gestor de contraseñas)

5. A partir de ese momento, la aplicación genera un código nuevo cada 30 segundos.

#### Paso 3: Login normal después de configurar 2FA

Cada vez que quiera entrar:

1. Pone usuario + contraseña.
2. El sistema le pide el código de 6 dígitos actual de la app.
3. Ingresa el código → accede.

Si pierde el celular:
- Puede usar los códigos de respaldo que generó la app al principio, o
- Tú (como Super Admin) puedes desactivarle el 2FA usando la contraseña maestra.

---

## 4. Recomendaciones al Vender el Software

Cuando entregues el sistema a un cliente, entrega siempre este documento o una versión simplificada con estos puntos:

### Entrega mínima recomendada:

1. Usuario y contraseña inicial del admin.
2. Instrucciones claras de cómo configurar 2FA (con capturas).
3. Recomendación fuerte de usar **Authy** (porque permite recuperar la cuenta si pierde el celular).
4. Tu número de WhatsApp de soporte (para que te escriban si tienen problemas con el 2FA).
5. Recordatorio de cambiar la contraseña inicial inmediatamente.

---

## 5. Estado Actual del Código (Mayo 2026)

### Portal del Cliente (Estado Actual - Mayo 2026)
- Flujo de Teléfono + Ticket implementado.
- Generación y almacenamiento de OTP con expiración (tabla `lead_otps`).
- Endpoint `POST /api/leads/verify` genera el código.
- Soporte preparado para enviar el OTP vía **Make.com** (webhook configurable con `MAKE_LEAD_OTP_WEBHOOK_URL`).
- En desarrollo local se muestra el código en consola + en el frontend para facilitar pruebas.
- **Próximo paso recomendado:** Crear el Scenario en Make.com que reciba el webhook y envíe el mensaje por WhatsApp Cloud API.

### 2FA para Admin
- Totalmente funcional usando TOTP (speakeasy).
- QR Code + verificación implementada.
- Se puede activar/desactivar por admin.

---

## 6. Integración con Make.com para Envío de OTP (Cliente Portal)

### Cómo funciona (diseño actual)

1. El cliente solicita ver su servicio desde el Portal (`/cliente`).
2. El backend genera un código OTP de 6 dígitos y lo guarda en la tabla `lead_otps`.
3. El backend hace una petición HTTP POST a la URL configurada en `MAKE_LEAD_OTP_WEBHOOK_URL`.
4. Make.com recibe el webhook con los datos (`phone`, `otp`, `ticket`, `client_name`).
5. Make.com usa el módulo de WhatsApp Cloud API para enviar el código al cliente.

### Configuración recomendada en Make.com

1. Crea un nuevo Scenario.
2. Primer módulo: **Webhooks → Custom webhook**.
3. Copia la URL y pégala en tu `.env` como:
   ```
   MAKE_LEAD_OTP_WEBHOOK_URL=https://hook.eu1.make.com/xxxxxxxxxxxx
   ```
4. Segundo módulo: **WhatsApp Cloud API → Send a message**.
5. Configura el mensaje (ejemplo):

   ```
   Hola {{client_name}},

   Tu código para consultar el estado de tu servicio en ServSoftBagm es:

   **{{otp}}**

   Ticket: {{ticket}}
   Este código expira en 10 minutos.
   ```

### Ventajas de esta arquitectura

- 100% gratis dentro de los límites de WhatsApp Cloud + Make.com.
- Fácil de mantener y evolucionar.
- El backend no necesita credenciales de WhatsApp (Make.com las maneja).
- Puedes agregar más acciones después (crear registro en Airtable, enviar email, etc.).

---

## 7. Próximos Pasos Recomendados

1. Configurar el Scenario en Make.com para envío de OTP del cliente.
2. Mejorar la experiencia visual del Portal del Cliente (agregar historial, más detalles del servicio).
3. Agregar opción para que el cliente pueda solicitar reenvío del código OTP.
4. Documentar y probar el proceso completo de entrega del software con 2FA activado (para cuando vendas el sistema).

---

**Este documento debe servirte como guía de estudio y referencia cuando vayas a vender o soportar el sistema.**

¿Quieres que ahora empecemos a implementar el envío del OTP por WhatsApp a través de Make.com (aunque sea con un webhook simulado por ahora)? O prefieres que primero mejoremos la interfaz del Portal del Cliente.