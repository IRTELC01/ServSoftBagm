import { useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL, resolvePhotoUrl } from '../api'
import { BANK_TRANSFER, BANK_QR_PATH, BANK_TRANSFER_TEXT } from '../config/bank'

export default function ClientPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [clientData, setClientData] = useState(null)
  const [phone, setPhone] = useState('')
  const [ticket, setTicket] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [error, setError] = useState('')
  const [isResending, setIsResending] = useState(false)

  // Paso 1: Solicitar verificación (genera OTP)
  const handleRequestVerification = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch(`${API_URL}/leads/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, ticket_number: ticket })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'No se encontraron datos con esa información')
        return
      }

      setShowOtpInput(true)

      if (data.otp) {
        // Modo desarrollo: mostramos el código
        alert(`Código de verificación (solo para pruebas locales): ${data.otp}\n\nEn producción este código te llegaría por WhatsApp.`);
      } else {
        // Modo producción / Make.com configurado
        alert('Se ha enviado un código de verificación a tu WhatsApp. Por favor revísalo e ingrésalo para continuar.');
      }

    } catch (err) {
      setError('Error de conexión con el servidor')
    }
  }

  // Paso 2: Verificar OTP contra el backend (real)
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch(`${API_URL}/leads/confirm-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          ticket_number: ticket,
          code: otp
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Código incorrecto o expirado')
        return
      }

      // Login exitoso
      setClientData({
        name: data.lead.name,
        phone: data.lead.phone,
        service: data.lead.service,
        status: data.lead.status,
        equipment: data.lead.equipment_description || 'Equipo registrado',
        lastUpdate: new Date().toLocaleDateString(),
        photos: data.lead.images || [],
        invoiceUrl: '#',
        platform: 'TeamViewer' // Esto lo puedes mejorar después
      })

      setIsLoggedIn(true)
      setShowOtpInput(false)

    } catch (err) {
      setError('Error de conexión al verificar el código')
    }
  }

  // Reenviar código OTP
  const handleResendCode = async () => {
    setIsResending(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/leads/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, ticket_number: ticket })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'No se pudo reenviar el código')
        return
      }

      if (data.otp) {
        alert(`Nuevo código (solo pruebas locales): ${data.otp}`)
      } else {
        alert('Se ha reenviado un nuevo código a tu WhatsApp.')
      }

    } catch (err) {
      setError('Error al reenviar el código')
    } finally {
      setIsResending(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card-float p-6">
          <h1 className="text-2xl font-bold mb-2 neon-title-green">Portal del Cliente</h1>
          <p className="text-sm text-white/70 mb-6">
            Consulta el estado de tu equipo ingresando tu teléfono y número de ticket.
          </p>

          {!showOtpInput ? (
            <form onSubmit={handleRequestVerification} className="space-y-4">
              <input 
                type="text" 
                placeholder="Tu número de teléfono" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-neon w-full" 
                required 
              />
              <input 
                type="text" 
                placeholder="Número de Ticket (ej: TKT-12345678)" 
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
                className="input-neon w-full" 
                required 
              />
              <button 
                type="submit"
                className="w-full py-3 rounded-xl bg-neon-green text-black font-semibold"
              >
                Solicitar Código de Verificación
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-white/80">
                Ingresa el código de 6 dígitos que apareció en la consola del servidor:
              </p>
              <input 
                type="text" 
                placeholder="Código OTP" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-neon w-full text-center tracking-[8px]" 
                maxLength={6}
                required 
              />
              <button 
                type="submit"
                className="w-full py-3 rounded-xl bg-neon-green text-black font-semibold"
              >
                Verificar y Entrar
              </button>

              <button 
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="w-full text-sm text-neon-cyan hover:underline disabled:opacity-50"
              >
                {isResending ? 'Enviando nuevo código...' : '¿No recibiste el código? Reenviar'}
              </button>

              <button 
                type="button"
                onClick={() => { setShowOtpInput(false); setOtp(''); setError('') }}
                className="w-full text-sm text-white/60 hover:text-white"
              >
                Volver
              </button>
            </form>
          )}

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <p className="text-xs text-white/50 mt-4 text-center">
            ¿No tienes tu ticket? Escríbenos por WhatsApp al <strong>301 504 5982</strong>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold neon-title-green">Portal del Cliente</h1>
        <button 
          onClick={() => { setIsLoggedIn(false); setClientData(null) }}
          className="text-sm text-neon-pink hover:underline"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Datos del servicio */}
        <div className="card-float p-5">
          <h2 className="text-xl font-semibold mb-4">Estado de tu Servicio</h2>
          
          <div className="mb-4">
            <span className="text-xs text-white/60">Estado actual</span>
            <div className={`mt-1 inline-flex px-3 py-1 rounded-full text-sm font-medium
              ${clientData.status === 'Listo para Entrega' ? 'bg-green-500/20 text-green-400' : ''}
              ${clientData.status === 'En Reparación' || clientData.status === 'En Diagnóstico' ? 'bg-yellow-500/20 text-yellow-400' : ''}
              ${clientData.status === 'Recibido' ? 'bg-blue-500/20 text-blue-400' : ''}
              ${clientData.status === 'Finalizado' ? 'bg-gray-500/20 text-gray-400' : ''}
            `}>
              {clientData.status}
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div><span className="text-white/60">Cliente:</span> <span className="font-medium">{clientData.name}</span></div>
            <div><span className="text-white/60">Teléfono:</span> {clientData.phone}</div>
            <div><span className="text-white/60">Servicio:</span> {clientData.service}</div>
            <div><span className="text-white/60">Última actualización:</span> {clientData.lastUpdate}</div>
            {clientData.platform && (
              <div><span className="text-white/60">Plataforma de soporte remoto:</span> {clientData.platform}</div>
            )}
          </div>
        </div>

        {/* Equipo + Imágenes */}
        <div className="card-float p-5">
          <h2 className="text-xl font-semibold mb-4">Tu Equipo</h2>
          <p className="text-sm mb-4">{clientData.equipment}</p>
          
          <div>
            <p className="text-xs text-white/60 mb-2">Fotos del diagnóstico / avance del servicio</p>
            {clientData.photos?.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {clientData.photos.map((photo, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={resolvePhotoUrl(photo)}
                      alt={`Equipo ${i+1}`}
                      className="rounded-lg border border-white/10 object-cover h-32 w-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/50">Aún no hay fotos disponibles para este servicio.</p>
            )}
          </div>
        </div>
      </div>

      {/* Factura */}
      <div className="mt-6 card-float p-5">
        <h2 className="text-xl font-semibold mb-3">Factura y Documentos</h2>
        <a 
          href={clientData.invoiceUrl} 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan/40 text-sm"
        >
          Descargar Factura Electrónica (PDF)
        </a>
        <p className="text-xs text-white/50 mt-2">Tu factura está disponible una vez finalizado el servicio.</p>
      </div>

      {/* Cómo pagar */}
      {BANK_TRANSFER.numeroCuenta && (
        <div className="mt-6 card-float p-5">
          <h2 className="text-xl font-semibold mb-4">Cómo pagar</h2>
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* QR */}
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-2xl p-3 shadow-lg shadow-black/30">
                <img
                  src={BANK_QR_PATH}
                  alt="QR BreB – Pago por transferencia"
                  className="w-52 h-52 object-contain rounded-xl"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <p className="text-xs text-white/50 mt-2 text-center">
                Abre tu app bancaria → Escanear → Apunta al QR
              </p>
            </div>

            {/* Datos de la cuenta */}
            <div>
              <h3 className="font-medium mb-3 text-sm text-white/80">Datos de la cuenta</h3>
              <pre className="bg-black/40 p-4 rounded-xl text-sm whitespace-pre-wrap font-mono border border-white/10 min-h-[110px]">
{BANK_TRANSFER_TEXT}
              </pre>
              <p className="text-xs text-white/50 mt-3 italic">
                Realiza la transferencia y envía el comprobante por WhatsApp al <strong>301 504 5982</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-white/60">
        ¿Necesitas actualizar tu información o tienes dudas? Escríbenos al WhatsApp <span className="text-neon-green">301 504 5982</span>
      </div>
    </div>
  )
}
