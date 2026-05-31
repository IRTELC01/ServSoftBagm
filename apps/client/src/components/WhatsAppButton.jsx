import { CONTACT_WHATSAPP, BRAND_NAME } from '../config'

// Professional, clean messages - direct to owner
const quickMessages = {
  desarrollo: `Hola, vi su página de ${BRAND_NAME} y estoy interesado en Desarrollo a medida. ¿Me puede dar información?`,
  soporte: `Hola, vi su página de ${BRAND_NAME} y estoy interesado en Soporte técnico. ¿Me puede dar información?`,
  mantenimiento: `Hola, vi su página de ${BRAND_NAME} y estoy interesado en Mantenimiento de equipos. ¿Me puede dar información?`,
  recuperacion: `Hola, vi su página de ${BRAND_NAME} y estoy interesado en Recuperación de datos. ¿Me puede dar información?`,
  general: `Hola, vi su página de ${BRAND_NAME}. Me gustaría recibir información sobre sus servicios.`
}

export default function WhatsAppButton() {
  if (!CONTACT_WHATSAPP) return null

  const openDirect = (key) => {
    const text = encodeURIComponent(quickMessages[key] || quickMessages.general)
    const url = `https://wa.me/${CONTACT_WHATSAPP}?text=${text}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Ultra minimal floating button - direct WhatsApp, no heavy UI
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-2">
      {/* Main clean button */}
      <button
        onClick={() => openDirect('general')}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-2xl shadow-black/60 transition-all hover:scale-110 active:scale-95"
        aria-label="Contactar por WhatsApp"
        title="Contactar por WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.67-.181-1.297-.497-.557-.248-1.01-.372-1.297-.372-.248 0-.446.05-.595.174-.149.124-.595.58-.595 1.412 0 .832.595 1.637.67 1.76.074.124 1.255 2.054 3.09 2.88 1.835.826 1.835.826 2.13.826.297 0 .446-.124.595-.248.149-.124.595-.58.595-1.164 0-.58-.446-1.04-.595-1.164z"/>
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.92-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.24-1.21l-.3-.18-2.92.855.86-2.84-.2-.3A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>
      </button>

      {/* Minimal quick options - no images, no heavy modal */}
      <div className="hidden group-hover:flex flex-col gap-1 text-xs">
        <button onClick={() => openDirect('desarrollo')} className="px-3 py-1 bg-black/70 hover:bg-black text-white rounded">Desarrollo a medida</button>
        <button onClick={() => openDirect('soporte')} className="px-3 py-1 bg-black/70 hover:bg-black text-white rounded">Soporte técnico</button>
        <button onClick={() => openDirect('mantenimiento')} className="px-3 py-1 bg-black/70 hover:bg-black text-white rounded">Mantenimiento</button>
      </div>
    </div>
  )
}
