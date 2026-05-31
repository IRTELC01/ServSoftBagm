/**
 * Google Calendar Service - Stub for future implementation
 * 
 * This will eventually:
 * - Use Google OAuth2 to access badolfogm@gmail.com calendar
 * - Check availability before suggesting slots
 * - Create events when appointment is confirmed
 * 
 * For free hosting (Render), this is complex because:
 * - Needs persistent token storage
 * - OAuth callback URLs
 * - Background refresh of tokens
 * 
 * Recommended approach when budget allows:
 * - Use Google Calendar API with service account or OAuth
 * - Store tokens securely (encrypted in DB or env for MVP)
 */

async function checkAvailability(date, durationMinutes = 60) {
  // TODO: Implement real Google Calendar check
  console.log(`[STUB] Checking availability for ${date}`);
  return { available: true, conflicts: [] };
}

async function createAppointment(appointmentData) {
  // appointmentData = { clientName, phone, address, service, datetime, notes }
  console.log('[STUB] Would create Google Calendar event:', appointmentData);
  return { success: true, eventId: 'stub-event-123' };
}

async function sendConflictNotificationToOwner(conflictDetails) {
  // TODO: Send email to badolfogm@gmail.com
  console.log('[STUB] Would send email about calendar conflict:', conflictDetails);
}

module.exports = {
  checkAvailability,
  createAppointment,
  sendConflictNotificationToOwner
};