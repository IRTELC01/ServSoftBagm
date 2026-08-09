import { useState } from 'react'
import { CONTACT_WHATSAPP, BRAND_NAME } from '../config'
import { API_URL } from '../api'

/**
 * Chatbot Web - Fase Validación (100% Gratis)
 * 
 * Este chatbot está diseñado para:
 * - Recopilar datos de forma estructurada del cliente
 * - Generar mensajes profesionales para WhatsApp
 * - Preparar datos listos para Make.com (webhook gratis)
 * 
 * Estrategia actual (sin pagar nada):
 * 1. Cliente usa este chatbot → datos limpios
 * 2. Se abre WhatsApp con mensaje estructurado al 3015045982
 * 3. Más adelante → conectamos este chatbot con Make.com vía webhook (gratis dentro del límite)
 *    para automatizar agenda, correos, Google Calendar, etc.
 */

const services = [
  { key: 'desarrollo', label: 'Desarrollo a medida' },
  { key: 'soporte', label: 'Soporte técnico' },
  { key: 'mantenimiento', label: 'Mantenimiento de equipos' },
  { key: 'recuperacion', label: 'Recuperación de datos' },
  { key: 'integracion', label: 'Integración de sistemas' },
  { key: 'automatizacion', label: 'Automatización y control' },
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState('start')
  const [selectedService, setSelectedService] = useState(null)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [address, setAddress] = useState('')
  const [requirement, setRequirement] = useState('')
  const [messages, setMessages] = useState([
    { from: 'bot', text: `Hola, soy el asistente de ${BRAND_NAME}.\n\nTe guiaré paso a paso. Responde con calma para que tu solicitud llegue clara y profesional.` }
  ])
  const [isSending, setIsSending] = useState(false)

  const addMessage = (from, text) => {
    setMessages(prev => [...prev, { from, text }])
  }

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    addMessage('user', service.label)
    addMessage('bot', `Entendido. Vamos a recopilar tus datos.\n\n¿Cuál es tu nombre completo?`)
    setStep('name')
  }

  // ==================== VALIDACIONES ESTRICTAS ====================
  const validateName = (value) => {
    const trimmed = value.trim()
    if (trimmed.length < 4) return 'Por favor escribe tu nombre completo.'
    const words = trimmed.split(/\s+/).filter(Boolean)
    if (words.length < 2) return 'Por favor ingresa al menos nombre y apellido.'
    if (words.some(w => w.length < 2)) return 'Cada parte del nombre debe tener al menos 2 letras.'
    if (/\d/.test(trimmed)) return 'El nombre no puede contener números.'
    return null
  }

  const validateContact = (value) => {
    const cleaned = value.replace(/\s+/g, '')
    if (!/^\d{7,11}$/.test(cleaned)) {
      return 'Ingresa un número de teléfono o cédula válido (solo números, entre 7 y 11 dígitos).'
    }
    // Rechazar patrones obvios de spam o prueba
    const spamPatterns = ['0000000', '1111111', '1234567', '12345678', '123456789', '9876543']
    if (spamPatterns.some(p => cleaned.includes(p))) {
      return 'El número ingresado no parece válido. Por favor usa tu teléfono o cédula real.'
    }
    // Rechazar números demasiado repetitivos
    if (/^(\d)\1{6,}$/.test(cleaned)) {
      return 'Por favor ingresa un número de contacto real.'
    }
    return null
  }

  const validateRequirement = (value) => {
    const trimmed = value.trim()
    if (trimmed.length < 20) {
      return 'Por favor describe tu necesidad con un poco más de detalle (mínimo 20 caracteres).'
    }
    // Rechazar texto muy repetitivo o sin sentido
    const words = trimmed.toLowerCase().split(/\s+/)
    const uniqueWords = new Set(words)
    if (words.length > 6 && uniqueWords.size < 4) {
      return 'Por favor escribe una descripción más clara de lo que necesitas.'
    }
    return null
  }

  // ==================== HANDLERS CON VALIDACIÓN ====================
  const handleNameSubmit = () => {
    const error = validateName(name)
    if (error) {
      addMessage('bot', error)
      return
    }
    addMessage('user', name)
    addMessage('bot', `Gracias ${name.split(' ')[0]}. ¿Cuál es tu teléfono o número de identificación (cédula)?`)
    setStep('contact')
  }

  const handleContactSubmit = () => {
    const error = validateContact(contact)
    if (error) {
      addMessage('bot', error)
      return
    }
    addMessage('user', contact)
    addMessage('bot', `Gracias. Ahora indícame la **dirección completa** o el lugar donde deseas el servicio (debe ser ubicable en Google Maps).`)
    setStep('address')
  }

  const handleAddressSubmit = () => {
    const trimmed = address.trim();
    if (!trimmed || trimmed.length < 12) {
      addMessage('bot', 'La dirección debe ser clara y completa (mínimo 12 caracteres). Ejemplo: "Calle 45 #23-12, Apto 301, Medellín, Antioquia"');
      return;
    }
    // Basic check for Colombian-style address
    if (!/[#]/.test(trimmed) && !/calle|cl|cra|carrera|av|avenida|manzana/i.test(trimmed)) {
      addMessage('bot', 'Por favor incluye más detalles en la dirección (calle, número, barrio o ciudad).');
      return;
    }
    addMessage('user', address);
    addMessage('bot', `Gracias. Ahora describe con detalle qué necesitas.`);
    setStep('requirement');
  }

  const handleRequirementSubmit = () => {
    const error = validateRequirement(requirement)
    if (error) {
      addMessage('bot', error)
      return
    }
    addMessage('user', requirement)

    const serviceName = selectedService.label
    addMessage('bot', `Gracias. Revisando nuestra capacidad...`)

    setTimeout(() => {
      addMessage('bot', `Sí contamos con el servicio de **${serviceName}**.`)
      addMessage('bot', `Por favor revisa el resumen antes de confirmar:`)
      addMessage('bot', `Nombre: ${name}\nTeléfono/Id: ${contact}\nDirección: ${address}\nRequerimiento: ${requirement}`)
      addMessage('bot', `¿Todo está correcto? Confirma para generar un mensaje profesional y enviarlo por WhatsApp.`)
      setStep('finish')
    }, 900)
  }

  const openWhatsAppWithData = async () => {
    if (!CONTACT_WHATSAPP || isSending) return

    setIsSending(true)

    const leadData = {
      name,
      phone: contact,
      address,
      service: selectedService.label,
      requirement
    }

    // Guardar lead en backend (público, sin autenticación)
    let ticketNumber = null;
    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      const data = await res.json();
      if (data.ticket_number) {
        ticketNumber = data.ticket_number;
      }
    } catch (err) {
      console.warn('No se pudo guardar el lead en backend:', err)
    }

    // Mensaje ultra estructurado
    const ticketLine = ticketNumber ? `Ticket: ${ticketNumber}\n` : '';

    const msg = 
`=== NUEVA SOLICITUD ===
Nombre: ${name}
Teléfono/ID: ${contact}
Dirección: ${address}
Servicio: ${selectedService.label}
${ticketLine}
Requerimiento:
${requirement}

---
Origen: Chatbot Web ServSoftBagm
Acción sugerida: Agendar servicio`

    const url = `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank', 'noopener,noreferrer')

    setTimeout(() => {
      let successMsg = '✅ Mensaje enviado. En breve te contactaremos para confirmar detalles y agendar.';
      if (ticketNumber) {
        successMsg += `\n\nTu número de ticket es: ${ticketNumber}. Guárdalo para consultar el estado de tu equipo en el Portal del Cliente.`;
      }
      addMessage('bot', successMsg);
      setIsSending(false);
      setTimeout(() => {
        resetChat();
      }, 3500);
    }, 1200)
  }

  const resetChat = () => {
    setIsOpen(false)
    setStep('start')
    setSelectedService(null)
    setName('')
    setContact('')
    setAddress('')
    setRequirement('')
    setMessages([{ from: 'bot', text: `Hola, soy el asistente de ${BRAND_NAME}. Te guiaré paso a paso para que tu solicitud llegue clara y organizada.` }])
    setIsSending(false)
  }

  return (
    <>
      {/* Floating Chat Button - Básico y profesional */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-[998] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/30 backdrop-blur hover:bg-white/15 transition-all"
        aria-label="Abrir asistente"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed bottom-40 right-6 z-[1000] w-[340px] rounded-2xl border border-white/15 bg-[#0f1324] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
            <div>
              <div className="font-semibold text-sm">Asistente {BRAND_NAME}</div>
              <div className="text-[10px] text-emerald-400">● En línea</div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={resetChat} 
                className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/70"
              >
                Reiniciar
              </button>
              <button onClick={resetChat} className="text-white/60 hover:text-white text-xl leading-none">×</button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[320px] overflow-y-auto p-4 space-y-3 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'bot' ? 'text-left' : 'text-right'}>
                <div className={`inline-block px-3 py-2 rounded-2xl max-w-[85%] ${m.from === 'bot' ? 'bg-white/10 text-white' : 'bg-neon-green/90 text-black'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-white/10 bg-[#0a0c18]">
            {step === 'start' && (
              <div>
                <p className="text-xs text-white/60 mb-2 px-1">Escribe el número o haz clic:</p>
                <div className="space-y-1">
                  {services.map((s, index) => (
                    <button
                      key={s.key}
                      onClick={() => handleServiceSelect(s)}
                      className="w-full text-left text-xs px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      {index + 1}. {s.label}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Escribe número (ej: 3)"
                    className="flex-1 bg-white/5 border border-white/15 rounded px-2 py-1 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const num = parseInt(e.target.value.trim());
                        if (num >= 1 && num <= services.length) {
                          handleServiceSelect(services[num - 1]);
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {step === 'name' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                />
                <button onClick={handleNameSubmit} className="px-4 bg-neon-green/90 text-black rounded-lg text-sm font-medium">Enviar</button>
              </div>
            )}

            {step === 'contact' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Teléfono o cédula/NIT"
                  className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleContactSubmit()}
                />
                <button onClick={handleContactSubmit} className="px-4 bg-neon-green/90 text-black rounded-lg text-sm font-medium">Enviar</button>
              </div>
            )}

            {step === 'address' && (
              <div className="space-y-2">
                <p className="text-xs text-white/60 px-1">
                  Escribe la dirección completa donde quieres el servicio (debe ser fácil de ubicar en Google Maps)
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle 45 #23-12, Apto 301, Medellín, Antioquia"
                    className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddressSubmit()}
                  />
                  <button onClick={handleAddressSubmit} className="px-4 bg-neon-green/90 text-black rounded-lg text-sm font-medium">Enviar</button>
                </div>
              </div>
            )}

            {step === 'requirement' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="Describe brevemente tu caso"
                  className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleRequirementSubmit()}
                />
                <button onClick={handleRequirementSubmit} className="px-4 bg-neon-green/90 text-black rounded-lg text-sm font-medium">Enviar</button>
              </div>
            )}

            {step === 'finish' && (
              <div className="space-y-2">
                <button
                  onClick={openWhatsAppWithData}
                  disabled={isSending}
                  className="w-full py-2.5 rounded-xl bg-[#25D366] text-black font-semibold text-sm hover:bg-[#20bd5a] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSending ? 'Abriendo WhatsApp...' : 'Confirmar y abrir WhatsApp'}
                </button>

                {/* Botón extra para preparar datos para Make.com (100% gratis) */}
                <button
                  onClick={() => {
                    const structuredData = {
                      nombre: name,
                      telefono: contact,
                      direccion: address,
                      servicio: selectedService.label,
                      requerimiento: requirement,
                      origen: "Chatbot Web ServSoftBagm"
                    };
                    navigator.clipboard.writeText(JSON.stringify(structuredData, null, 2));
                    addMessage('bot', '✅ Datos estructurados copiados. Puedes pegarlos en Make.com cuando conectemos el webhook (gratis).');
                  }}
                  className="w-full py-2 text-xs bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white/80"
                >
                  Copiar datos estructurados (para Make.com)
                </button>

                <button
                  onClick={() => {
                    addMessage('bot', 'Entendido. ¿Quieres corregir algún dato?')
                    setStep('requirement')
                  }}
                  className="w-full py-2 text-xs text-white/70 hover:text-white"
                >
                  Corregir datos
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
