# ✅ Production Readiness Checklist — ServSoftBagm

Usa esta lista antes de cada despliegue a producción real.

## 1. Seguridad

- [ ] `npm audit --audit-level=high` limpio en `server/`
- [ ] `MASTER_ENABLE=false` en el entorno de producción
- [ ] `JWT_SECRET` es un valor aleatorio fuerte (64+ caracteres), diferente de cualquier default
- [ ] `DEFAULT_ADMIN_PASSWORD` cambiado y 2FA activado para la cuenta admin real
- [ ] `OPEN_ACCESS` no está presente o es explícitamente `false`
- [ ] Variables sensibles no están en el código ni en git history
- [ ] CORS solo permite los dominios reales de frontend
- [ ] Helmet configurado (o headers de seguridad equivalentes)

## 2. Datos y Respaldo

- [ ] PostgreSQL en producción con backups automáticos funcionando
- [ ] Script de backup probado (restore de prueba realizado en los últimos 30 días)
- [ ] `DATA_DIR` configurado correctamente si usas SQLite
- [ ] No hay datos de prueba sensibles en la base de producción

## 3. Facturación y Negocio

- [ ] Generación de PDF de factura funciona correctamente
- [ ] El PDF incluye disclaimer claro: "Documento de gestión interna - no sustituye factura electrónica DIAN"
- [ ] Usuario ha probado el flujo completo: crear factura → descargar PDF → verificar totales
- [ ] Se ha decidido si se usará proveedor externo (Siigo, Alegra, etc.) para facturación legal

## 4. Despliegue

- [ ] Build de producción del cliente (`npm run build`) exitoso
- [ ] Imagen Docker del backend construida y probada localmente
- [ ] Health check `/` y `/api/auth/health` responden correctamente en el entorno destino
- [ ] Smoke test (`node scripts/smoke-test.js`) pasa contra la URL de producción
- [ ] Variables de entorno verificadas en el panel de hosting (Render/Railway/etc.)
- [ ] Dominio + HTTPS configurado y accesible

## 5. WhatsApp (si está en uso)

- [ ] Webhook verificado en Meta Business
- [ ] `WHATSAPP_VERIFY_TOKEN` coincide en `.env` y en Meta
- [ ] Número de WhatsApp Business aprobado
- [ ] Pruebas reales de los 4 flujos conversacionales realizadas

## 6. Monitoreo y Alertas

- [ ] Sentry / servicio de error tracking configurado (frontend + backend)
- [ ] Uptime monitoring (UptimeRobot, BetterStack, etc.) apuntando a la URL
- [ ] Alerta configurada para uso del master password (si está habilitado)
- [ ] Logs estructurados visibles en el servicio de hosting

## 7. Legal y Cumplimiento (Colombia)

- [ ] Política de privacidad publicada (mínima)
- [ ] Términos de servicio / condiciones de uso publicadas
- [ ] Aviso visible sobre naturaleza de las facturas generadas (internas)
- [ ] Si se manejan datos personales: mecanismo de solicitud de eliminación documentado

## 8. Operación

- [ ] Runbook de emergencia existe (`docs/INCIDENT_RESPONSE.md`)
- [ ] Al menos 2 personas conocen cómo hacer rollback (o procedimiento documentado)
- [ ] Primera factura real de un cliente de prueba generada exitosamente
- [ ] Contraseña del admin rotada después del primer login en prod

---

## Sign-off

**Preparado por:** ___________________________ Fecha: ___________

**Revisado por:** ___________________________ Fecha: ___________

**Aprobado para deploy:** [ ] Sí   [ ] No (razón: ________________)

**URL de producción:** https://_______________________________

**Commit / Tag desplegado:** _______________________________
