# 🚀 Guía de Despliegue en Render.com + Neon (Paso a Paso)

Esta guía despliega **ServSoftBagm en producción** gratis en Render (backend +
frontend) usando **Postgres en Neon** como base de datos (Render tiene disco
efímero: SQLite se borraría en cada deploy/restart).

> ⚠️ **NUNCA despliegues desde `main`**. `main` todavía contiene datos
> bancarios reales expuestos en el historial de git (ver `CLAUDE.md`, sección
> "Cómo continuar"). El despliegue debe salir de una rama de fixes
> (`chore/pre-deploy-hardening` o la que la reemplace tras mergearse) hasta
> que se resuelva ese pendiente.

---

## ✅ Requisitos Previos

1. Cuenta en [Render.com](https://render.com) (gratis)
2. Cuenta en [Neon.tech](https://neon.tech) (gratis) con una base de datos Postgres creada
3. El código en un repositorio de GitHub, desplegado desde la rama correcta (no `main`)
4. Haber probado localmente que funciona (recomendado)

---

## 📌 Paso 1: Crea la base de datos en Neon

1. Entra a [Neon.tech](https://neon.tech) y crea un proyecto/base de datos nueva
2. Copia la **connection string** (formato `postgresql://usuario:password@host/dbname?sslmode=require`)
3. Guárdala: la necesitarás en el Paso 4 para `DATABASE_URL`

---

## 📌 Paso 2: Despliega usando Blueprint en Render (Recomendado)

1. Entra a [https://dashboard.render.com](https://dashboard.render.com)
2. Haz clic en **"New +"** (botón azul arriba a la derecha)
3. Selecciona **"Blueprint"**
4. Conecta tu cuenta de GitHub (si no lo has hecho)
5. Busca y selecciona tu repositorio `ServSoftBagm`
6. Render detectará automáticamente el archivo `render.yaml`
7. Haz clic en **"Apply"**

Render creará **dos servicios** automáticamente:
- `servsoftbagm-api` (Backend)
- `servsoftbagm-web` (Frontend estático)

---

## 📌 Paso 3: Configura las variables obligatorias del Backend

En `render.yaml` varias variables quedaron marcadas como `sync: false`
(Render no les pone valor automáticamente; hay que pegarlas a mano en el
dashboard antes de que el servicio funcione):

En el servicio **servsoftbagm-api** → pestaña **Environment**:

1. `DATABASE_URL` → pega la connection string de Neon del Paso 1
2. `DEFAULT_ADMIN_PASSWORD` → una contraseña fuerte y única (NUNCA
   `servsoft123` ni ningún valor de ejemplo del repo)
3. `FRONTEND_ORIGIN` → se completa en el Paso 6, una vez exista la URL del frontend

El resto (`DB_DRIVER=pg`, `OPEN_ACCESS=false`, `MASTER_ENABLE=false`,
`JWT_SECRET`) ya vienen fijados en `render.yaml`.

---

## 📌 Paso 4: Espera el primer deploy del Backend

- Ve a la sección **"servsoftbagm-api"**
- Espera a que el estado cambie a **"Live"**
- Una vez que esté Live, **copia la URL** que aparece arriba (ejemplo):
  ```
  https://servsoftbagm-api-abc123.onrender.com
  ```

> **Importante**: No copies todavía el frontend. Solo el API.

---

## 📌 Paso 5: Configura la variable crítica del Frontend (VITE_API_URL)

Este es el paso **más importante**.

1. Entra al servicio **"servsoftbagm-web"**
2. Ve a la pestaña **"Environment"**
3. Busca la variable `VITE_API_URL`
4. **Reemplaza** el valor actual por la URL real de tu API + `/api`

   **Ejemplo correcto:**
   ```
   https://servsoftbagm-api-abc123.onrender.com/api
   ```

5. Haz clic en **"Save Changes"**
6. Render te preguntará si quieres redeployar → haz clic en **"Deploy"**

---

## 📌 Paso 6: Configura FRONTEND_ORIGIN en el Backend

Con `OPEN_ACCESS=false`, el backend solo acepta peticiones desde orígenes
explícitamente permitidos.

1. En el servicio **servsoftbagm-api** → pestaña **Environment**
2. Edita (o crea) la variable:
   - **Key**: `FRONTEND_ORIGIN`
   - **Value**: La URL completa de tu frontend estático
     ```
     https://servsoftbagm-web-xyz123.onrender.com
     ```
3. Guarda y redeploya el **API**.

---

## 📌 Paso 7: Verifica que todo funcione

1. Abre la URL de tu frontend (`servsoftbagm-web`)
2. Haz clic en "Acceso Admin"
3. Ingresa con:
   - Usuario: `admin`
   - Contraseña: la que definiste como `DEFAULT_ADMIN_PASSWORD` en el Paso 3
4. Deberías entrar al **Dashboard**
5. Crea una factura de prueba
6. Verifica que aparezca en la lista y que los gráficos se actualicen

---

## 🔐 Notas de Seguridad

- `OPEN_ACCESS` / `VITE_OPEN_ACCESS` deben quedar en `false` en producción
  real. `render.yaml` ya trae ese valor por defecto — solo actívalos en
  `true` para una demo temporal y desactívalos después.
- `DEFAULT_ADMIN_PASSWORD` es obligatorio configurarlo manualmente (no tiene
  valor por defecto en `render.yaml`). Nunca reutilices `servsoft123` ni
  ningún placeholder de `.env.example`.
- `JWT_SECRET` se genera automáticamente (`generateValue: true`), no hace
  falta tocarlo.
- Recomendado: activa 2FA para el usuario `admin` desde el panel de Login
  después del primer acceso.

---

## ❗ Problemas Comunes y Soluciones

| Problema | Solución |
|---------|---------|
| Frontend no se conecta al API | Verifica que `VITE_API_URL` termine en `/api` y que el API esté Live |
| Error CORS | Asegúrate de tener `FRONTEND_ORIGIN` configurado correctamente en el API |
| Build falla en backend | Revisa los logs del servicio `servsoftbagm-api`. A veces hay que hacer "Clear build cache" + Manual Deploy |
| Error de conexión a la base de datos | Verifica que `DATABASE_URL` esté bien pegada (incluye `?sslmode=require`) y que la base de Neon esté activa |
| No puedo iniciar sesión | Verifica que configuraste `DEFAULT_ADMIN_PASSWORD` manualmente en el Paso 3 antes del primer deploy |
| Cambios no se ven | Siempre haz "Manual Deploy" después de cambiar variables de entorno |

---

## 📞 URLs útiles después del deploy

- **Frontend (pública)**: `https://servsoftbagm-web-XXXX.onrender.com`
- **API**: `https://servsoftbagm-api-XXXX.onrender.com`
- **Health check API**: `https://servsoftbagm-api-XXXX.onrender.com/`

---

## ¿Listo?

Sigue los pasos en orden. Si te atoras en algún punto, copia el error exacto de los logs de Render y pégalo aquí.
