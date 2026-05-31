# SECURITY POLICY — ServSoftBagm

**Este repositorio maneja (o manejará) datos financieros y de clientes reales.**

Por favor lee **obligatoriamente** el documento completo de higiene de repositorio y pre-commit:

→ **[docs/security/REPOSITORY_SECURITY_GIT_HYGIENE_AND_PRE_COMMIT_CHECKLIST.md](docs/security/REPOSITORY_SECURITY_GIT_HYGIENE_AND_PRE_COMMIT_CHECKLIST.md)**

## Resumen rápido de reglas inquebrantables

1. **Nunca commitees** archivos reales `.env`, `server/.env`, tokens de WhatsApp, URLs de Make.com, contraseñas, ni datos bancarios.
2. Los datos bancarios reales (cuenta + QR) **solo** pueden existir dentro de `client/public/Ayudas/REAL/`. Todo lo demás está bloqueado por `.gitignore`.
3. Siempre ejecuta el **Checklist Pre-Commit** (sección 5 del documento de seguridad) antes de hacer `git add` en ramas importantes.
4. El backup del .gitignore anterior está en: `.gitignore.backup-before-2026-security-shield`

Cualquier duda de seguridad → revisa primero el documento de guía de estudio en `docs/security/`.

**Este archivo existe para que cualquiera que clone el repo vea inmediatamente la seriedad con la que se trata la información sensible.**
