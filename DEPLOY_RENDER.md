# 🚀 Guía de Despliegue en Render.com (Paso a Paso)

Esta guía te permite tener **ServSoftBagm en producción hoy mismo** de forma gratuita.

---

## ✅ Requisitos Previos

1. Cuenta en [Render.com](https://render.com) (gratis)
2. El código en un repositorio de GitHub (puedes hacer fork o usar tu propio repo)
3. Haber probado localmente que funciona (recomendado)

---

## 📌 Paso 1: Prepara tu repositorio en GitHub

```bash
# Asegúrate de estar en la rama main con los últimos cambios
git status
git add .
git commit -m "chore: preparar despliegue en Render"
git push origin main
```

> **Recomendación**: Haz un **fork** del repositorio original si no quieres modificar el tuyo todavía.

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

## 📌 Paso 3: Espera el primer deploy del Backend

- Ve a la sección **"servsoftbagm-api"**
- Espera a que el estado cambie a **"Live"** (puede tardar 2-4 minutos la primera vez por la compilación de better-sqlite3)
- Una vez que esté Live, **copia la URL** que aparece arriba (ejemplo):
  ```
  https://servsoftbagm-api-abc123.onrender.com
  ```

> **Importante**: No copies todavía el frontend. Solo el API.

---

## 📌 Paso 4: Configura la variable crítica del Frontend (VITE_API_URL)

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

## 📌 Paso 5: Configura VITE_OPEN_ACCESS (para Demo Pública)

Mientras tengas la variable `VITE_OPEN_ACCESS=true`, cualquier persona podrá entrar al Dashboard sin login.

**Recomendado para hoy (demo):**

1. En el servicio **servsoftbagm-web**, ve a **Environment**
2. Asegúrate que exista esta variable:
   - `VITE_OPEN_ACCESS` = `true`

3. En el servicio **servsoftbagm-api**, ve a **Environment** y verifica:
   - `OPEN_ACCESS` = `true`

---

## 📌 Paso 6: (Opcional pero recomendado) Configura FRONTEND_ORIGIN

Para mayor seguridad (aunque uses `OPEN_ACCESS=true`):

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
3. Usa las credenciales por defecto:
   - Usuario: `admin`
   - Contraseña: `servsoft123`
4. Deberías entrar al **Dashboard** mejorado
5. Crea una factura de prueba
6. Verifica que aparezca en la lista y que los gráficos se actualicen

---

## 🔐 Pasos de Seguridad (Después de la Demo)

Cuando quieras pasar a producción real:

### En `servsoftbagm-api`:
- Cambia `DEFAULT_ADMIN_PASSWORD` a una contraseña fuerte
- Cambia `OPEN_ACCESS` a `false`
- Asegúrate de tener un `JWT_SECRET` fuerte (ya se genera automáticamente)

### En `servsoftbagm-web`:
- Cambia `VITE_OPEN_ACCESS` a `false`

### Recomendado:
- Activa 2FA para el usuario `admin` desde el panel de Login
- Cambia el nombre de los servicios si lo deseas (desde Settings)

---

## ❗ Problemas Comunes y Soluciones

| Problema | Solución |
|---------|---------|
| Frontend no se conecta al API | Verifica que `VITE_API_URL` termine en `/api` y que el API esté Live |
| Error CORS | Asegúrate de tener `FRONTEND_ORIGIN` configurado correctamente en el API |
| Build falla en backend | Revisa los logs del servicio `servsoftbagm-api`. A veces hay que hacer "Clear build cache" + Manual Deploy |
| better-sqlite3 falla | En Render normalmente funciona. Si falla, ve a la config del servicio y agrega en Build Command: `npm ci --build-from-source` |
| Cambios no se ven | Siempre haz "Manual Deploy" después de cambiar variables de entorno |

---

## 📞 URLs útiles después del deploy

- **Frontend (pública)**: `https://servsoftbagm-web-XXXX.onrender.com`
- **API**: `https://servsoftbagm-api-XXXX.onrender.com`
- **Health check API**: `https://servsoftbagm-api-XXXX.onrender.com/`

---

## ¿Listo?

Sigue los pasos en orden. Si te atoras en algún punto, copia el error exacto de los logs de Render y pégalo aquí.

**¡Hoy puedes tener tu aplicación pública!** 🔥
