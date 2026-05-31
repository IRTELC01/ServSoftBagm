# REPOSITORY SECURITY, GIT HYGIENE & PRE-COMMIT CHECKLIST
## Guía de Estudio Profesional para ServSoftBagm (Enero 2026)

**Proyecto**: ServSoftBagm — Sistema de gestión de servicios técnicos + facturación + portal de clientes + automatizaciones WhatsApp + (futuro) manejo de transacciones financieras vía transferencias bancarias.

**Fecha de este blindaje**: 2026 (activado antes del commit "checkpoint: chatbot and leads functional")

**Autor de la auditoría**: Grok 4.3 siguiendo instrucciones estrictas del propietario.

---

## 1. FILOSOFÍA DE SEGURIDAD (Por qué esto es crítico)

Este no es un proyecto de "juguete". En el mediano plazo manejará:

- Datos de clientes reales (nombre, teléfono, dirección, fotos de equipos).
- Estados de servicio y facturación.
- **Instrucciones bancarias reales** (número de cuenta, titular, QR de pago).
- Secretos de automatización (Make.com webhooks, WhatsApp Cloud tokens, JWTs, contraseñas de admin).
- Posiblemente integración futura con pasarelas de pago.

**Una sola clave o dato bancario que llegue a GitHub = fuga permanente e irreversible**, incluso si se borra después. Los atacantes y scrapers indexan repositorios públicos en minutos.

**Regla de oro**:
> "Si un archivo contiene o *podría* contener información que en producción sería sensible, **nunca debe entrar al índice de Git**."

---

## 2. AUDITORÍA REALIZADA EN ESTA SESIÓN (Hallazgos Críticos)

Se ejecutó una auditoría completa **antes** de cualquier commit de checkpoint.

### 2.1 Archivos sensibles que **ESTABAN en riesgo de ser subidos** con `git add -A`

Estos archivos **NO estaban siendo ignorados** correctamente por el .gitignore anterior:

- `client/backup/personal-images-originales/` → 17 archivos PNG (imágenes personales originales del proyecto anterior).
- `client/public/Ayudas/Cuenta.txt` → Archivo con datos bancarios (actualmente placeholders, pero el usuario planea poner datos reales + QR).

**Consecuencia si no se hubiera corregido**: Al ejecutar el commit del PASO 1, todo esto habría entrado al historial de Git para siempre.

### 2.2 Archivos .env que existen en el disco (correctamente ignorados en la mayoría de casos)

| Archivo                        | Contenido sensible detectado                  | Estado en Git (antes del blindaje) |
|--------------------------------|-----------------------------------------------|------------------------------------|
| `server/.env`                  | DATABASE_URL, JWT_SECRET, DEFAULT_ADMIN_PASSWORD | Ignorado (bueno)                  |
| `root .env`                    | DB_PASSWORD                                   | Ignorado (bueno)                  |
| `client/.env.production`       | (vacío, pero estructura)                      | **¡TRACKED!** (riesgo)            |
| `server/.env.example`          | Ejemplos de tokens y URLs                     | Tracked (aceptable si se mantiene como ejemplo) |

**Lección**: El .gitignore anterior era insuficiente para la carpeta `Ayudas/` y backups personales.

### 2.3 Archivos ya trackeados que contienen riesgo potencial

- `client/.env.production` estaba en el índice de Git.
- Esto se documenta aquí para que el propietario decida si hacer `git rm --cached` + agregar nota en el commit de limpieza (nunca borrar historial).

---

## 3. EL NUEVO .gitignore PROFESIONAL (Qué se mejoró)

Se creó `.gitignore` endurecido + backup del anterior (` .gitignore.backup-before-2026-security-shield`).

**Mejoras clave**:

1. **Sección explícita de "Financial & Bank Data"** — la más importante para este proyecto.
2. Patrón de carpetas `REAL/` y `real/` dentro de Ayudas para que el desarrollador pueda poner los datos reales localmente sin riesgo.
3. Excepciones (`!`) solo para archivos claramente marcados como `EJEMPLO_*` o `README.md`.
4. Cobertura de futuros proveedores de pago (Stripe, PayU, etc.).
5. Cobertura de tokens permanentes de WhatsApp / Evolution API / Make.com.
6. Reglas para backups personales y fotos originales.
7. Comentarios educativos en cada sección (para que sea una guía viva).

**Regla de oro implementada**:
- Solo se permite commitear archivos de ejemplo con nombres que griten "ESTO ES EJEMPLO".

---

## 4. POLÍTICA OFICIAL PARA DATOS BANCARIOS Y QR (Transferencias)

**Decisión de arquitectura (tomada en este blindaje)**:

### Opción recomendada y obligatoria:

1. En `client/public/Ayudas/` solo vivirán archivos **claramente marcados como ejemplo**:
   - `EJEMPLO_Cuenta.txt`
   - `EJEMPLO_QRBanco.jpeg` (puede ser un QR falso o de prueba)
   - `README.md` explicando exactamente cómo el desarrollador debe crear su propia carpeta `REAL/`

2. El código del Dashboard (y futuros componentes) debe:
   - Primero buscar en una ruta git-ignored (`/Ayudas/REAL/`)
   - Si no existe, mostrar un banner grande de advertencia + usar los archivos de ejemplo.
   - Nunca hardcodear rutas a archivos reales.

3. El archivo real `Cuenta.txt` y el QR real **nunca** deben estar dentro de `client/public/Ayudas/` con nombres normales.

4. Documentación: El `README.md` dentro de Ayudas debe explicar el procedimiento exacto para el propietario.

**Esto permite**:
- Que el Dashboard siga mostrando la sección "Datos para Transferencias" en desarrollo y demo.
- Que nunca se filtre información real aunque el repositorio sea público.

---

## 5. CHECKLIST PRE-COMMIT OBLIGATORIO (Ejecutar SIEMPRE antes de `git add`)

Copia este checklist y ejecútalo **literalmente** antes de cada commit importante (especialmente el del PASO 1).

### 5.1 Comandos de verificación (PowerShell / Git Bash)

```powershell
# 1. Ver qué archivos se van a agregar (dry-run)
git add -A --dry-run

# 2. Ver específicamente archivos sensibles que podrían entrar
git add -A --dry-run | Select-String -Pattern "Ayudas|Cuenta|QR|backup|personal|\\.env|\\.db|secret|token" -CaseSensitive:$false

# 3. Listar todos los archivos que .gitignore está ignorando actualmente
git ls-files --others --ignored --exclude-standard | Select-String -Pattern "Ayudas|Cuenta|QR|\\.env|backup"

# 4. Buscar posibles secretos hardcodeados en archivos que SÍ están trackeados
git ls-files | ForEach-Object { 
    if (Test-Path $_) { 
        Select-String -Path $_ -Pattern "DATABASE_URL|JWT_SECRET|password|token|sk-|ghp_|MAKE_" -CaseSensitive:$false -ErrorAction SilentlyContinue 
    } 
}

# 5. Ver el estado real
git status
```

### 5.2 Checklist humano (marca cada ítem)

- [ ] Revisé que `server/.env` no aparezca en `git add -A --dry-run`
- [ ] Revisé que `client/public/Ayudas/Cuenta.txt` o cualquier QR real esté bloqueado
- [ ] Revisé que la carpeta `client/backup/` completa esté bloqueada
- [ ] No hay archivos .log grandes o con datos de clientes
- [ ] No hay capturas de pantalla con datos sensibles en la carpeta del proyecto
- [ ] Los archivos .example y EJEMPLO_* tienen solo datos falsos/obvios
- [ ] Si agregué un nuevo servicio (Stripe, nuevo webhook, etc.), actualicé .gitignore primero
- [ ] Ejecuté `git status --ignored` y revisé la sección "Ignored files"

---

## 6. QUÉ HACER SI DESCUBRES QUE UN SECRETO YA FUE COMMITTEADO

**Nunca hagas esto**:
- `git reset --hard`
- Borrar el archivo y hacer commit normal

**Procedimiento correcto** (documentado para estudio):

1. Inmediatamente rota el secreto en todos los lugares donde se usa (Render, base de datos, WhatsApp, etc.).
2. Usa `git filter-repo` o BFG Repo-Cleaner (herramienta externa) para reescribir el historial eliminando el archivo.
3. Fuerza push con `git push --force-with-lease` (solo si eres el único colaborador).
4. Notifica a GitHub para purgar cachés si el repo es público.
5. Actualiza este documento con la fecha del incidente y la lección aprendida.

---

## 7. ESTRUCTURA RECOMENDADA DE CARPETAS SENSIBLES (Futuro)

```
client/public/
├── Ayudas/
│   ├── README.md                    ← Instrucciones obligatorias
│   ├── EJEMPLO_Cuenta.txt
│   ├── EJEMPLO_QRBanco.jpeg
│   └── REAL/                        ← Esta carpeta está en .gitignore
│       ├── Cuenta.txt               ← Tus datos reales (solo en tu máquina)
│       └── QRBanco.jpeg
```

El código del frontend debe preferir la carpeta `REAL/` cuando exista.

---

## 8. LECCIONES PERMANENTES PARA ESTE PROYECTO

1. **El .gitignore es código vivo**. Cada vez que agregues una nueva integración (pasarela de pago, nuevo proveedor de WhatsApp, n8n, etc.), debes actualizarlo el mismo día.
2. **Los backups personales siempre van a `client/backup/`** y esa carpeta está prohibida en Git.
3. **Nunca confíes en "ya lo tengo en .gitignore"**. Siempre haz dry-run antes de commits grandes.
4. **La documentación de seguridad también es parte del producto**. Este archivo es tan importante como el código del motor de IA.
5. **Cuando el proyecto maneje dinero real**, considera agregar un script de pre-commit hook (husky o similar) que ejecute automáticamente parte de este checklist.

---

## 9. COMANDOS DE RECUPERACIÓN Y VERIFICACIÓN ADICIONALES

```bash
# Ver el historial de cambios al .gitignore
git log --oneline --follow -- .gitignore

# Ver exactamente qué archivos de un commit serían sensibles (útil después del checkpoint)
git show --name-only <commit-hash>

# Buscar en todo el historial (puede tardar)
git log -S "DATABASE_URL" --oneline
```

---

## 10. ESTADO DESPUÉS DE ESTE BLINDAJE

- [x] Backup del .gitignore anterior creado
- [x] Nuevo .gitignore profesional escrito y documentado
- [x] Carpeta `docs/security/` creada (sin borrar nada)
- [x] Auditoría completa de .env y carpetas sensibles realizada
- [x] Política clara para datos bancarios definida
- [x] Checklist ejecutable para el propietario
- [x] Este documento de estudio creado

**Próximo paso seguro**:
El propietario debe:
1. Leer este documento completo.
2. Ejecutar el checklist de la sección 5 **en su máquina local**.
3. Solo entonces proceder con los comandos de PASO 1 del plan original (`git add -A`, commit checkpoint, crear rama `feat/telemetry-clean-architecture`).

---

**Firma del documento**:
ServSoftBagm Security Shield v1.0 — Activado antes de cualquier commit que incluya módulos de telemetría, analítica o IA.

Este archivo debe mantenerse actualizado en cada cambio relevante de infraestructura o automatización.

---

*Fin del documento guía de estudio. Léelo completo antes de continuar con el PASO 1 del plan de Git.*