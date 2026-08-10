import { useEffect, useMemo, useState } from 'react'
import { createInvoice, listInvoices, getSummary, addTransaction, API_URL, resolvePhotoUrl } from '../api'
import { WORKSHOP_NAME, WORKSHOP_PHONES, WORKSHOP_ADDRESS, WORKSHOP_NIT_LABEL, CONTACT_WHATSAPP, BRAND_NAME } from '../config'
import { BANK_TRANSFER_TEXT, BANK_QR_PATH } from '../config/bank'

// ===== PREMIUM INVOICE FORM =====
function InvoiceForm({ onCreated }) {
  const [customer_name, setCustomer] = useState('Cliente')
  const [address, setAddress] = useState('Medellín')
  const [phone, setPhone] = useState('3001234567')
  const [service_type, setServiceType] = useState('soporte')
  const [service_value, setServiceValue] = useState(65000)
  const [line_items, setItems] = useState([])
  const [labor_cost, setLabor] = useState(15000)
  const [vat_enabled, setVatEnabled] = useState(true)
  const [vat_percent, setVatPercent] = useState(19)
  const [payment_method, setPay] = useState('efectivo')
  const [notes, setNotes] = useState('')

  const items_total = (service_value || 0) + line_items.reduce((s,i)=> s + Number(i.price) * Number(i.qty||1), 0)
  const subtotal = items_total + Number(labor_cost||0)
  const vat = vat_enabled ? Math.round(subtotal * (Number(vat_percent||0)/100)) : 0
  const total = subtotal + vat

  const addItem = () => setItems([...line_items, { name: 'Repuesto', qty: 1, price: 28000 }])
  const updateItem = (idx, key, val) => { const copy = [...line_items]; copy[idx] = { ...copy[idx], [key]: val }; setItems(copy) }
  const removeItem = (idx) => setItems(line_items.filter((_,i)=>i!==idx))

  const submit = async (e) => {
    e.preventDefault()
    const baseItemName = ({soporte:'Soporte técnico', mantenimiento:'Mantenimiento', desarrollo:'Desarrollo de software', licencias:'Licencias/Software'})[service_type] || 'Servicio técnico'
    const payloadItems = [ { name: baseItemName, qty: 1, price: Number(service_value||0) }, ...line_items ]
    const r = await createInvoice({ customer_name, address, phone, line_items: payloadItems, labor_cost, vat_percent: vat_enabled ? vat_percent : 0, payment_method, notes })
    if (r.ok) {
      onCreated()
      // reset suave
      setItems([])
      setNotes('')
    }
  }

  const clearForm = () => {
    setCustomer('Cliente')
    setAddress('Medellín')
    setPhone('3001234567')
    setServiceType('soporte')
    setServiceValue(65000)
    setItems([])
    setLabor(15000)
    setVatEnabled(true)
    setVatPercent(19)
    setPay('efectivo')
    setNotes('')
  }

  return (
    <div className="neon-card p-6 border-neon-green/40 glow-green">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="uppercase tracking-[3px] text-[10px] text-neon-green font-semibold">NUEVA FACTURA</div>
          <h3 className="text-2xl font-bold tracking-tight">Facturación Rápida</h3>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/50">TOTAL A COBRAR</div>
          <div className="total-glow tabular-nums">${total.toLocaleString()}</div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5">
        {/* Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-widest text-white/60 block mb-1.5">Cliente / Empresa</label>
            <input className="input-neon w-full" value={customer_name} onChange={e=>setCustomer(e.target.value)} placeholder="Nombre del cliente" required />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-white/60 block mb-1.5">Teléfono</label>
            <input className="input-neon w-full" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="300 000 0000" />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs uppercase tracking-widest text-white/60 block mb-1.5">Dirección</label>
            <input className="input-neon w-full" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Dirección de servicio" />
          </div>
        </div>

        {/* Servicio */}
        <div>
          <label className="text-xs uppercase tracking-widest text-white/60 block mb-1.5">Tipo de servicio</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              {v:'soporte', l:'Soporte técnico'},
              {v:'mantenimiento', l:'Mantenimiento'},
              {v:'desarrollo', l:'Desarrollo SW'},
              {v:'licencias', l:'Licencias'}
            ].map(opt => (
              <button type="button" key={opt.v} onClick={()=>setServiceType(opt.v)}
                className={`px-4 py-2.5 rounded-xl text-sm border transition ${service_type===opt.v ? 'bg-neon-green/20 border-neon-green text-neon-green font-semibold' : 'bg-white/5 border-white/15 hover:bg-white/10'}`}>
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <label className="text-xs uppercase tracking-widest text-white/60 block mb-1.5">Valor del servicio</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-white/40">$</span>
              <input type="number" className="input-neon w-full pl-7" value={service_value} onChange={e=>setServiceValue(Number(e.target.value))} />
            </div>
          </div>
          <div className="md:col-span-4">
            <label className="text-xs uppercase tracking-widest text-white/60 block mb-1.5">Mano de obra</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-white/40">$</span>
              <input type="number" className="input-neon w-full pl-7" value={labor_cost} onChange={e=>setLabor(Number(e.target.value))} />
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="text-xs uppercase tracking-widest text-white/60 block mb-1.5">IVA</label>
            <div className="flex items-center gap-2 bg-white/5 border border-white/15 rounded-xl px-3 h-[52px]">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={vat_enabled} onChange={e=>setVatEnabled(e.target.checked)} className="accent-neon-green" />
                <span>19%</span>
              </label>
              <input type="number" className="bg-transparent w-14 text-center border-l border-white/20 focus:outline-none" value={vat_percent} onChange={e=>setVatPercent(Number(e.target.value))} disabled={!vat_enabled} />
            </div>
          </div>
        </div>

        {/* Ítems adicionales */}
        {line_items.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-widest text-white/60">Ítems adicionales</div>
            {line_items.map((it, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-white/5 rounded-xl p-2">
                <input className="col-span-5 input-neon py-2 text-sm" value={it.name} onChange={e=>updateItem(i,'name',e.target.value)} />
                <input type="number" className="col-span-2 input-neon py-2 text-sm" value={it.qty} onChange={e=>updateItem(i,'qty',Number(e.target.value))} />
                <div className="col-span-4 relative">
                  <span className="absolute left-3 top-2.5 text-xs text-white/40">$</span>
                  <input type="number" className="input-neon w-full pl-6 py-2 text-sm" value={it.price} onChange={e=>updateItem(i,'price',Number(e.target.value))} />
                </div>
                <button type="button" onClick={()=>removeItem(i)} className="col-span-1 text-neon-pink hover:bg-white/10 rounded-lg py-2">×</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={addItem} className="px-4 py-2 text-sm rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 flex items-center gap-2">
            + Añadir repuesto / ítem
          </button>
          <select value={payment_method} onChange={e=>setPay(e.target.value)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-sm">
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notas o descripción del trabajo..." className="input-neon w-full min-h-[68px] text-sm" />

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="text-xs text-white/60">
            Subtotal <span className="text-white/90 font-medium">${subtotal.toLocaleString()}</span> · IVA <span className="text-white/90 font-medium">${vat.toLocaleString()}</span>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={clearForm} className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-sm">Limpiar</button>
            <button type="submit" className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-neon-green to-[#2aff4a] text-black font-bold text-sm active:scale-[0.985] transition">GUARDAR FACTURA</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function Dashboard() {
  const [invoices, setInvoices] = useState([])
  const [summary, setSummary] = useState({ income:0, expense:0, assets:0, liabilities:0, profit:0 })
  const [tx, setTx] = useState({ type:'expense', category:'insumos', amount: 25000, reference: 'compra repuestos' })
  const [compactView, setCompactView] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Leads from backend
  const [leads, setLeads] = useState([])
  const [isLoadingLeads, setIsLoadingLeads] = useState(false)
  const [uploadingLeadId, setUploadingLeadId] = useState(null)

  // === NUEVO: Estado para Telemetría e IA (Clean Architecture - solo UI) ===
  const [telemetry, setTelemetry] = useState(null)
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState(false)
  const [iaQuery, setIaQuery] = useState('')
  const [iaResponse, setIaResponse] = useState(null)
  const [isAskingIA, setIsAskingIA] = useState(false)
  const [facturaSearch, setFacturaSearch] = useState('') // Filtro local para tabla compacta de facturas

  // Cargar leads al montar el componente
  useEffect(() => {
    loadLeads()
  }, [])

  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    address: '',
    service: '',
    status: 'Pendiente',
    notes: ''
  })

  const invoiceSummary = useMemo(() => {
    const count = invoices.length
    const subtotal = invoices.reduce((s,i)=> s + Number(i.subtotal||0), 0)
    const vat = invoices.reduce((s,i)=> s + Number(i.vat_amount||0), 0)
    const total = invoices.reduce((s,i)=> s + Number(i.total||0), 0)
    return { count, subtotal, vat, total }
  }, [invoices])

  const filteredInvoices = useMemo(() => {
    if (!searchTerm.trim()) return invoices
    const q = searchTerm.toLowerCase()
    return invoices.filter(inv =>
      (inv.customer_name || '').toLowerCase().includes(q) ||
      (inv.notes || '').toLowerCase().includes(q) ||
      String(inv.id).includes(q)
    )
  }, [invoices, searchTerm])

  // === NUEVO: Filtro local ultra-rápido para la tabla compacta de facturas (100% client-side) ===
  const compactFacturas = useMemo(() => {
    const q = facturaSearch.toLowerCase().trim()
    let result = invoices
    if (q) {
      result = invoices.filter(inv =>
        (inv.customer_name || '').toLowerCase().includes(q) ||
        String(inv.consecutive || inv.id).includes(q) ||
        (inv.id + '').includes(q)
      )
    }
    return result.slice(0, 5) // Solo las 5 más recientes / relevantes - libera espacio visual
  }, [invoices, facturaSearch])

  const refresh = async () => {
    const inv = await listInvoices(); setInvoices(inv || [])
    const sum = await getSummary(); setSummary(sum || summary)
  }

  useEffect(() => { 
    refresh() 
    loadTelemetry() // Carga inicial del nuevo módulo de telemetría
  }, [])

  const addTx = async (e) => {
    e.preventDefault()
    const r = await addTransaction({ ...tx, amount: Number(tx.amount) })
    if (r.ok) refresh()
  }

  // Registrar lead manualmente (también intenta guardar en backend)
  const addLead = async () => {
    if (!newLead.name.trim() || !newLead.phone.trim()) {
      alert('Nombre y teléfono son obligatorios')
      return
    }

    const buttonWasDisabled = false // for future loading state

    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newLead.name,
          phone: newLead.phone,
          address: newLead.address,
          service: newLead.service,
          requirement: newLead.notes
        })
      })

      if (!res.ok) {
        let errorMessage = 'Error al registrar el lead'
        try {
          const err = await res.json()
          errorMessage = err.error || errorMessage
          if (err.details) errorMessage += `\n\nDetalles: ${err.details}`
          console.error('Backend error al registrar lead:', err)
        } catch {}
        alert(errorMessage)
        return
      }

      // Recargar desde backend para actualizar la lista y el contador
      await loadLeads()

      // Limpiar formulario
      setNewLead({
        name: '',
        phone: '',
        address: '',
        service: '',
        status: 'Pendiente',
        notes: ''
      })

      // Feedback visual
      alert('Lead registrado correctamente. La lista y el contador se actualizaron.')
    } catch (e) {
      console.error('Error registrando lead:', e)
      alert('No se pudo registrar el lead. Revisa la consola.')
    }
  }

  // Cargar leads desde el backend
  const loadLeads = async () => {
    setIsLoadingLeads(true)
    try {
      const res = await fetch(`${API_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('runaway_token') || ''}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setLeads(data)
      }
    } catch (err) {
      console.error('Error cargando leads:', err)
    }
    setIsLoadingLeads(false)
  }

  // Cambiar estado de un lead
  const updateLeadStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('runaway_token') || ''}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l))
      } else {
        alert('Error al actualizar el estado')
      }
    } catch (err) {
      alert('Error de conexión al actualizar')
    }
  }

  // Subir foto(s) de evidencia (diagnóstico/reparación) de un lead
  const uploadLeadPhotos = async (id, files) => {
    if (!files || files.length === 0) return
    setUploadingLeadId(id)
    try {
      const formData = new FormData()
      Array.from(files).forEach(f => formData.append('photos', f))

      const res = await fetch(`${API_URL}/leads/${id}/photos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('runaway_token') || ''}` },
        body: formData
      })

      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setLeads(leads.map(l => l.id === id ? { ...l, images: JSON.stringify(data.images) } : l))
      } else {
        alert(data.error || 'Error al subir las fotos')
      }
    } catch (err) {
      alert('Error de conexión al subir las fotos')
    }
    setUploadingLeadId(null)
  }

  // Limpiar todos los leads de prueba (borra en el backend, no solo la UI)
  const clearAllLeads = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar TODOS los leads de prueba? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('runaway_token') || ''}` }
      })

      if (res.ok) {
        localStorage.removeItem('servsoftbagm_leads');
        await loadLeads();
        alert('Leads eliminados correctamente.');
      } else {
        const data = await res.json().catch(() => ({}))
        alert(data.error || 'Error al eliminar leads');
      }
    } catch (err) {
      alert('Error de conexión al eliminar leads');
    }
  }

  // === NUEVO: Carga de Telemetría desde el servicio agnóstico (solo UI) ===
  const loadTelemetry = async () => {
    setIsLoadingTelemetry(true)
    try {
      const token = localStorage.getItem('runaway_token')
      const res = await fetch(`${API_URL}/leads/telemetry`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      if (res.ok) {
        const data = await res.json()
        setTelemetry(data)
      } else {
        console.warn('No se pudo cargar telemetría (posiblemente sin token válido)')
      }
    } catch (e) {
      console.error('Error cargando telemetría:', e)
    }
    setIsLoadingTelemetry(false)
  }



  // === NUEVO: Asistente IA de Decisiones (conectado al motor agnóstico) ===
  const askIA = async () => {
    if (!iaQuery.trim() || iaQuery.trim().length < 4) {
      alert('Escribe una consulta más larga (mínimo 4 caracteres)')
      return
    }
    setIsAskingIA(true)
    setIaResponse(null)
    try {
      const token = localStorage.getItem('runaway_token')
      const res = await fetch(`${API_URL}/leads/telemetry/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ query: iaQuery.trim() })
      })
      const data = await res.json()
      if (res.ok) {
        setIaResponse(data)
      } else {
        setIaResponse({ error: data.error || 'Error en el motor IA' })
      }
    } catch (e) {
      setIaResponse({ error: 'No se pudo conectar con el asistente IA' })
    }
    setIsAskingIA(false)
  }

  // ===== VISUAL CHARTS (pure CSS + SVG, zero deps) =====
  const income = Number(summary.income || 0)
  const expense = Number(summary.expense || 0)
  const profit = Number(summary.profit || 0)
  const totalFacturado = invoiceSummary.total

  const maxBar = Math.max(income, expense, 1)
  const incomePct = Math.round((income / maxBar) * 100)
  const expensePct = Math.round((expense / maxBar) * 100)

  // Donut percentages (income vs expense)
  const totalAcc = income + expense || 1
  const incomeDeg = Math.round((income / totalAcc) * 360)
  const expenseDeg = 360 - incomeDeg

  const logout = () => {
    // Limpieza completa de sesión
    localStorage.removeItem('runaway_token')
    localStorage.removeItem('servsoftbagm_leads') // opcional: limpiar leads de prueba también

    // Forzar recarga completa para limpiar cualquier estado en memoria
    window.location.href = '/login?loggedOut=true'
  }

  const exportCSV = () => {
    const headers = ['ID','Fecha','Cliente','Total','IVA','Forma Pago']
    const rows = invoices.map(i => [
      i.consecutive || i.id,
      i.date?.slice(0,16) || '',
      (i.customer_name||'').replace(/,/g,' '),
      i.total,
      i.vat_amount || 0,
      i.payment_method || ''
    ])
    const csv = [headers, ...rows].map(r=>r.join(',')).join('\n')
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `facturas_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-[#0a0a12] min-h-screen text-white">
      {/* DASHBOARD HEADER - FUTURISTA */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a12]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neon-green/90 flex items-center justify-center">
                <span className="text-black font-black text-xl tracking-tighter">S</span>
              </div>
              <div>
                <div className="font-bold text-2xl tracking-[-1.5px]">{BRAND_NAME}</div>
                <div className="text-[10px] text-neon-green -mt-1 font-mono">PANEL DE CONTROL</div>
              </div>
            </div>
            {/* Badge de modo eliminado por solicitud del usuario - solo se muestra en producción real */}
          </div>

          <div className="flex items-center gap-2">
            <a href={`https://wa.me/${CONTACT_WHATSAPP}`} target="_blank" rel="noreferrer"
               className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/15 hover:bg-green-500/25 border border-green-500/40 text-sm">
              💬 WhatsApp Soporte
            </a>
            <button onClick={() => window.location.href = '/'} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-sm">Ir al sitio</button>
            <button onClick={logout} className="px-5 py-2 rounded-xl bg-neon-pink/10 hover:bg-neon-pink/20 border border-neon-pink/50 text-sm text-neon-pink">Cerrar sesión</button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-5 pb-16 pt-8 space-y-9">
        {/* HERO KPIs - GRANDES Y NEON */}
        <div>
          {/* Professional Dashboard Header with organized asset */}
        <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-neon-green text-xs tracking-[3px] font-semibold">RESUMEN EN TIEMPO REAL</div>
              <h1 className="text-4xl font-bold tracking-[-1.6px]">Dashboard Financiero</h1>
            </div>
            <div className="text-right hidden md:block text-sm text-white/50">
              {new Date().toLocaleDateString('es-CO', { weekday:'long', day:'numeric', month:'short' })}
            </div>
          </div>

          {/* Contacto visible en el Dashboard */}
          <div className="mb-6 p-4 rounded-2xl border border-white/15 bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <div>
              <span className="text-white/70">¿Necesitas soporte o información?</span>{" "}
              <a href="mailto:servsoftbagm@gmail.com" className="text-neon-cyan font-medium hover:underline">servsoftbagm@gmail.com</a>
            </div>
            {CONTACT_WHATSAPP && (
              <a 
                href={`https://wa.me/${CONTACT_WHATSAPP}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-sm"
              >
                💬 Contactar por WhatsApp
              </a>
            )}
          </div>

          {/* Datos Bancarios para Transferencias - Configuración limpia */}
          <div className="mb-8 card-float p-5 border border-white/15">
            <h3 className="text-lg font-semibold mb-4">Datos para Transferencias</h3>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h4 className="font-medium mb-2 text-sm text-white/80">Información de la Cuenta</h4>
                <pre className="bg-black/40 p-4 rounded-xl text-sm whitespace-pre-wrap font-mono border border-white/10 min-h-[110px]">
{BANK_TRANSFER_TEXT}
                </pre>
                <p className="text-xs text-white/40 mt-2 italic">
                  Información privada – solo visible en el panel administrativo
                </p>
              </div>

              <div className="flex flex-col items-center">
                <h4 className="font-medium mb-2 text-sm text-white/80">Código QR para Pagos</h4>
                <div className="border border-white/20 rounded-2xl p-2 bg-white/5">
                  <img 
                    src={BANK_QR_PATH} 
                    alt="QR para transferencias bancarias" 
                    className="w-48 h-48 object-contain rounded-xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = 
                        '<div class="w-48 h-48 flex items-center justify-center text-white/50 text-xs text-center leading-tight p-2">' +
                        'Coloca tu QR en:<br/>' +
                        '<span class="font-mono text-neon-cyan">public/assets/bank/QRBanco.jpeg</span>' +
                        '</div>';
                    }}
                  />
                </div>
                <p className="text-xs text-white/60 mt-2 text-center">Escanea para pagar</p>
              </div>
            </div>
          </div>

          {/* Sección de Leads / Clientes - Registro Manual */}
          <div className="mb-8 card-float p-5 border border-white/15">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Leads y Clientes</h3>
                <p className="text-xs text-white/60">Registra manualmente los contactos que llegan por WhatsApp</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20">
                {leads.length} registrados
              </span>
            </div>

            {/* Formulario simple para registrar lead */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <input
                type="text"
                placeholder="Nombre completo"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                className="input-neon text-sm"
              />
              <input
                type="text"
                placeholder="Teléfono o cédula"
                value={newLead.phone}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                className="input-neon text-sm"
              />
              <input
                type="text"
                placeholder="Dirección / Lugar del servicio"
                value={newLead.address}
                onChange={(e) => setNewLead({ ...newLead, address: e.target.value })}
                className="input-neon text-sm md:col-span-2"
              />
              <select
                value={newLead.service}
                onChange={(e) => setNewLead({ ...newLead, service: e.target.value })}
                className="input-neon text-sm"
              >
                <option value="">Servicio solicitado</option>
                <option value="Desarrollo a medida">Desarrollo a medida</option>
                <option value="Soporte técnico">Soporte técnico</option>
                <option value="Mantenimiento de equipos">Mantenimiento de equipos</option>
                <option value="Recuperación de datos">Recuperación de datos</option>
                <option value="Integración de sistemas">Integración de sistemas</option>
                <option value="Automatización y control">Automatización y control</option>
              </select>
              <input
                type="text"
                placeholder="Estado (Pendiente, Contactado, Agendado...)"
                value={newLead.status}
                onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                className="input-neon text-sm"
              />
              <textarea
                placeholder="Notas adicionales..."
                value={newLead.notes}
                onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                className="input-neon text-sm md:col-span-2 min-h-[60px]"
              />
            </div>

            <button
              onClick={addLead}
              className="px-5 py-2 rounded-xl bg-neon-green/90 text-black font-semibold text-sm hover:bg-neon-green transition"
            >
              Registrar Lead
            </button>

            {/* Lista de leads desde backend */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white/80">Leads registrados</h4>
                <div className="flex gap-2">
                <button 
                  onClick={loadLeads} 
                  disabled={isLoadingLeads}
                  className="text-xs px-3 py-1 rounded bg-white/10 hover:bg-white/15 disabled:opacity-50"
                >
                  {isLoadingLeads ? 'Cargando...' : 'Actualizar'}
                </button>
                <button 
                  onClick={clearAllLeads}
                  className="text-xs px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                >
                  Limpiar datos de prueba
                </button>
              </div>
              </div>

              {leads.length === 0 && !isLoadingLeads && (
                <p className="text-xs text-white/50">No hay leads registrados aún.</p>
              )}

              <div className="space-y-3">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{lead.name}</div>
                        <div className="text-white/70 text-xs">{lead.phone} • {lead.service}</div>
                        <div className="text-white/60 text-xs mt-1">{lead.address}</div>
                      </div>
                      <div>
                        <select 
                          value={lead.status} 
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="text-xs bg-white/10 border border-white/20 rounded px-2 py-0.5"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Contactado">Contactado</option>
                          <option value="Agendado">Agendado</option>
                          <option value="Finalizado">Finalizado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </div>
                    </div>

                    {lead.requirement && (
                      <div className="mt-2 text-xs text-white/70 border-l border-white/20 pl-2">
                        {lead.requirement}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        const structured = {
                          nombre: lead.name,
                          telefono: lead.phone,
                          direccion: lead.address,
                          servicio: lead.service,
                          requerimiento: lead.requirement || '',
                          origen: 'WhatsApp / Chatbot'
                        };
                        navigator.clipboard.writeText(JSON.stringify(structured, null, 2));
                        alert('Datos estructurados copiados');
                      }}
                      className="mt-2 text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white/70"
                    >
                      Copiar datos
                    </button>

                    {/* Subir foto(s) de evidencia (diagnóstico/reparación) al lead */}
                    <div className="mt-2">
                      <label className="inline-block text-[10px] px-2 py-0.5 bg-neon-cyan/70 text-black rounded hover:bg-neon-cyan cursor-pointer">
                        {uploadingLeadId === lead.id ? 'Subiendo...' : '+ Foto'}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={uploadingLeadId === lead.id}
                          onChange={(e) => { uploadLeadPhotos(lead.id, e.target.files); e.target.value = '' }}
                        />
                      </label>
                    </div>

                    {lead.images && JSON.parse(lead.images).length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {JSON.parse(lead.images).map((photo, i) => (
                          <a key={i} href={resolvePhotoUrl(photo)} target="_blank" rel="noreferrer" title={photo}>
                            <img
                              src={resolvePhotoUrl(photo)}
                              alt={`Evidencia ${i + 1}`}
                              className="w-10 h-10 object-cover rounded border border-white/15 hover:border-neon-cyan/60"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dashboard images from public/ (reliable for current setup) */}
          <div className="mb-6 rounded-2xl overflow-hidden border border-white/10">
            <img 
              src="/imgWeb1.png" 
              alt="ServSoftBagm Dashboard" 
              className="w-full h-48 object-cover opacity-90"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* KPI 1 */}
            <div className="stat-card neon-border-green glow-green">
              <div className="text-xs uppercase tracking-widest text-neon-green/80">Facturas emitidas</div>
              <div className="stat-number mt-2 tabular-nums text-neon-green">{invoiceSummary.count}</div>
              <div className="mt-auto pt-3 text-xs text-white/50">Total facturado: <span className="text-white/90 font-medium">${totalFacturado.toLocaleString()}</span></div>
            </div>

            {/* KPI 2 */}
            <div className="stat-card neon-border-cyan glow-cyan">
              <div className="text-xs uppercase tracking-widest text-neon-cyan/80">Ingresos (contabilidad)</div>
              <div className="stat-number mt-2 tabular-nums text-neon-cyan">${income.toLocaleString()}</div>
              <div className="mt-1 text-[11px] text-white/50">Registrados vía facturas + manuales</div>
            </div>

            {/* KPI 3 */}
            <div className="stat-card neon-border-pink glow-pink">
              <div className="text-xs uppercase tracking-widest text-neon-pink/80">Gastos</div>
              <div className="stat-number mt-2 tabular-nums text-neon-pink">${expense.toLocaleString()}</div>
              <div className="mt-auto pt-4">
                <div className="bar-track"><div className="bar-fill bg-neon-pink" style={{width: `${expensePct}%`}} /></div>
              </div>
            </div>

            {/* KPI 4 - GANANCIA (la más importante) */}
            <div className={`stat-card ${profit >= 0 ? 'neon-border-green glow-green' : 'neon-border-pink'}`}>
              <div className="text-xs uppercase tracking-widest text-white/60">Ganancia Neta</div>
              <div className={`stat-number mt-2 tabular-nums ${profit >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
                {profit >= 0 ? '+' : ''}${profit.toLocaleString()}
              </div>
              <div className="text-[11px] mt-1 text-white/50">
                {profit >= 0 ? 'Operación rentable' : 'Revisar gastos'}
              </div>
            </div>

            {/* KPI 5 */}
            <div className="stat-card neon-border-yellow">
              <div className="text-xs uppercase tracking-widest text-yellow-400/80">Margen aproximado</div>
              <div className="stat-number mt-1 tabular-nums text-yellow-400">
                {totalFacturado > 0 ? Math.round((profit / totalFacturado) * 100) : 0}%
              </div>
              <div className="text-xs text-white/50 mt-2">Facturado vs ganancia contable</div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* FORMULARIO DE FACTURA - PREMIUM */}
          <div className="lg:col-span-3">
            <InvoiceForm onCreated={refresh} />
          </div>

          {/* RESUMEN CONTABLE CON GRÁFICOS */}
          <div className="lg:col-span-2 neon-card p-6 border-neon-cyan/30">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs tracking-[2px] text-neon-cyan">CONTABILIDAD</div>
                <div className="font-semibold text-xl">Resumen Visual</div>
              </div>
              <button onClick={refresh} className="text-xs px-3 py-1 rounded-lg border border-white/20 hover:bg-white/5">Actualizar</button>
            </div>

            {/* DONUT CHART + Supporting Dashboard image for Accounting state */}
            <div className="flex justify-center mb-6">
              <div className="relative flex flex-col items-center">
                <div className="donut" style={{
                  '--c1': '#39ff14',
                  '--c2': '#ff3cac',
                  '--p1': incomeDeg + 'deg',
                  '--p2': '360deg'
                }} />
                <div className="absolute text-center mt-9">
                  <div className="text-[10px] tracking-widest text-white/50">BALANCE</div>
                  <div className={`text-3xl font-bold tabular-nums ${profit>=0?'text-neon-green':'text-neon-pink'}`}>${profit.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Supporting image for accounting section */}
            <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
              <img 
                src="/Imagen5.png" 
                alt="Estado Contabilidad" 
                className="w-full h-32 object-cover opacity-85"
              />
            </div>

            {/* BAR CHARTS */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-neon-cyan">Ingresos</span>
                  <span className="font-medium tabular-nums">${income.toLocaleString()}</span>
                </div>
                <div className="bar-track"><div className="bar-fill bg-neon-cyan" style={{width: `${incomePct}%`}} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-neon-pink">Gastos</span>
                  <span className="font-medium tabular-nums">${expense.toLocaleString()}</span>
                </div>
                <div className="bar-track"><div className="bar-fill bg-neon-pink" style={{width: `${expensePct}%`}} /></div>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm">
                <span className="text-white/70">Resultado neto</span>
                <span className={`font-bold tabular-nums ${profit>=0?'text-neon-green':'text-neon-pink'}`}>
                  {profit>=0?'+':''}${profit.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-6 text-xs">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">Activos: <span className="font-semibold">${Number(summary.assets||0).toLocaleString()}</span></div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">Pasivos: <span className="font-semibold">${Number(summary.liabilities||0).toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        {/* TRANSACCIONES MANUALES + ATAJOS */}
        <div className="neon-card p-5">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="min-w-[160px]">
              <div className="uppercase tracking-[2px] text-xs text-neon-pink">Movimientos rápidos</div>
              <div className="font-semibold">Registrar transacción</div>
            </div>
            <form onSubmit={addTx} className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <select value={tx.type} onChange={e=>setTx({...tx,type:e.target.value})} className="input-neon py-3 text-sm">
                <option value="income">Ingreso</option><option value="expense">Gasto</option>
                <option value="asset">Activo</option><option value="liability">Pasivo</option>
              </select>
              <input value={tx.category} onChange={e=>setTx({...tx,category:e.target.value})} placeholder="Categoría" className="input-neon" />
              <input type="number" value={tx.amount} onChange={e=>setTx({...tx,amount:e.target.value})} placeholder="Monto" className="input-neon" />
              <input value={tx.reference} onChange={e=>setTx({...tx,reference:e.target.value})} placeholder="Referencia / nota" className="input-neon lg:col-span-1" />
              <button className="bg-neon-pink/80 hover:bg-neon-pink text-black font-semibold rounded-xl">+ AÑADIR</button>
            </form>
          </div>
        </div>

        {/* SECCIÓN FACTURAS COMPACTA - CYBERPUNK EJECUTIVA (Refactor Clean UI) */}
        <div className="neon-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-xl tracking-tight">Facturas emitidas</h3>
              <div className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono">{compactFacturas.length} / {invoices.length}</div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <input
                value={facturaSearch}
                onChange={e => setFacturaSearch(e.target.value)}
                placeholder="Buscar por Ticket o Cliente..."
                className="input-neon text-sm py-1.5 px-3 w-64"
              />
              <button onClick={exportCSV} className="px-3 py-1.5 text-xs rounded-xl border border-white/15 bg-white/5 hover:bg-white/10">Exportar CSV</button>
            </div>
          </div>

          {compactFacturas.length === 0 && (
            <div className="text-xs text-white/50 py-3">No hay facturas que coincidan con el filtro. Crea una arriba.</div>
          )}

          {/* Tabla ultra-compacta neón - reemplaza las tarjetas masivas */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/50 text-xs border-b border-white/10">
                  <th className="text-left py-2 pr-3 font-normal">#</th>
                  <th className="text-left py-2 pr-3 font-normal">Cliente</th>
                  <th className="text-right py-2 pr-3 font-normal">Total</th>
                  <th className="text-left py-2 pr-3 font-normal hidden md:table-cell">Método</th>
                  <th className="text-right py-2 font-normal">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {compactFacturas.map((inv) => {
                  const consec = String((inv.consecutive ?? (inv.id-1)%10000)).padStart(4,'0')
                  return (
                    <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-2 pr-3 font-mono text-neon-green text-xs">#{consec}</td>
                      <td className="py-2 pr-3 font-medium text-white/90">{inv.customer_name || 'Cliente'}</td>
                      <td className="py-2 pr-3 text-right tabular-nums font-semibold">${Number(inv.total || 0).toLocaleString()}</td>
                      <td className="py-2 pr-3 text-xs text-white/60 hidden md:table-cell">{inv.payment_method || 'efectivo'}</td>
                      <td className="py-2 text-right">
                        <button 
                          onClick={() => { navigator.clipboard.writeText(String(inv.total)); alert('Total copiado') }}
                          className="text-[10px] px-2 py-0.5 rounded border border-white/15 hover:bg-white/10 mr-1"
                        >
                          $
                        </button>
                        <button 
                          onClick={() => {
                            const lines = [`FACTURA #${consec}`, `Cliente: ${inv.customer_name||''}`, `TOTAL: $${Number(inv.total).toLocaleString()}`]
                            const blob = new Blob([lines.join('\n')], {type:'text/plain'})
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a'); a.href = url; a.download = `Factura_${consec}.txt`; a.click(); URL.revokeObjectURL(url)
                          }}
                          className="text-[10px] px-2 py-0.5 rounded border border-white/15 hover:bg-white/10"
                        >
                          TXT
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="text-[10px] text-white/40 mt-2">Mostrando las 5 más recientes. Usa el buscador para filtrar por Ticket o Cliente (100% local, sin tocar la BD).</div>
        </div>

        {/* ===================================================== */}
        {/* NUEVO: CENTRO DE TELEMETRÍA + ASISTENTE IA (Clean Architecture) */}
        {/* ===================================================== */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Centro de Telemetría Operacional & Data Analytics */}
          <div className="lg:col-span-3 neon-card p-5 border-neon-cyan/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-neon-cyan text-xs tracking-[2px] font-semibold">OPERACIONAL EN TIEMPO REAL</div>
                <h3 className="text-xl font-bold tracking-tight flex items-center gap-2 flex-wrap">
                  Centro de Telemetría & Analytics
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-yellow-400/15 border border-yellow-400/40 text-yellow-300">
                    Beta — datos de demostración
                  </span>
                </h3>
              </div>
              <button 
                onClick={loadTelemetry} 
                disabled={isLoadingTelemetry}
                className="text-xs px-3 py-1 rounded bg-white/5 border border-white/15 hover:bg-white/10 disabled:opacity-50"
              >
                {isLoadingTelemetry ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>

            {!telemetry && !isLoadingTelemetry && (
              <div className="text-xs text-white/50">Cargando métricas desde el servicio agnóstico...</div>
            )}

            {telemetry && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Micro-tarjeta 1: SLA */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] text-neon-green/70 tracking-widest">SLA / RESOLUCIÓN</div>
                  <div className="text-3xl font-bold tabular-nums mt-1 text-neon-green">{telemetry.sla?.tasaResolucion ?? 0}<span className="text-base align-super">%</span></div>
                  <div className="text-xs text-white/60 mt-0.5">{telemetry.sla?.estado}</div>
                </div>

                {/* Micro-tarjeta 2: Seguridad / Integridad */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] text-neon-cyan/70 tracking-widest">INTEGRIDAD / SEGURIDAD</div>
                  <div className="text-3xl font-bold tabular-nums mt-1 text-neon-cyan">{telemetry.security?.integridadDatos ?? 0}<span className="text-base align-super">%</span></div>
                  <div className="text-xs text-white/60 mt-0.5">{telemetry.security?.nivelSeguridad}</div>
                </div>

                {/* Micro-tarjeta 3: CSAT Predictivo */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] text-neon-pink/70 tracking-widest">CSAT PREDICTIVO</div>
                  <div className="text-3xl font-bold tabular-nums mt-1 text-neon-pink">{telemetry.csat?.score ?? 0}</div>
                  <div className="text-xs text-white/60 mt-0.5">{telemetry.csat?.tendencia}</div>
                </div>

                {/* Micro-tarjeta 4: Data Science Readiness */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] text-yellow-400/70 tracking-widest">DATA SCIENCE</div>
                  <div className="text-3xl font-bold tabular-nums mt-1 text-yellow-400">{telemetry.dataScience?.completitud ?? 0}<span className="text-base align-super">%</span></div>
                  <div className="text-xs text-white/60 mt-0.5">{telemetry.dataScience?.aptoParaModelos ? 'LISTO PARA ML' : 'EN PROGRESO'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Asistente IA de Decisiones */}
          <div className="lg:col-span-2 neon-card p-5 border-neon-pink/30 flex flex-col">
            <div className="text-neon-pink text-xs tracking-[2px] font-semibold mb-1">INTELIGENCIA OPERATIVA</div>
            <h3 className="text-xl font-bold tracking-tight mb-3 flex items-center gap-2 flex-wrap">
              Asistente IA de Decisiones
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-yellow-400/15 border border-yellow-400/40 text-yellow-300">
                Beta — datos de demostración
              </span>
            </h3>

            <div className="flex gap-2 mb-3">
              <input
                value={iaQuery}
                onChange={e => setIaQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && askIA()}
                placeholder="Ej: ¿Qué leads requieren atención prioritaria?"
                className="input-neon flex-1 text-sm"
              />
              <button 
                onClick={askIA} 
                disabled={isAskingIA || !iaQuery.trim()}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-neon-pink/80 hover:bg-neon-pink text-black disabled:opacity-50"
              >
                {isAskingIA ? 'Pensando...' : 'Preguntar'}
              </button>
            </div>

            {iaResponse && (
              <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-sm overflow-auto max-h-[220px]">
                {iaResponse.error ? (
                  <div className="text-neon-pink">{iaResponse.error}</div>
                ) : (
                  <>
                    <div className="text-white/70 text-xs mb-1.5">RESPUESTA DEL MOTOR AGNÓSTICO</div>
                    <div className="leading-snug">{iaResponse.respuesta}</div>
                    {iaResponse.accionesSugeridas?.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-white/10">
                        <div className="text-[10px] text-neon-pink/70 mb-1">ACCIONES SUGERIDAS</div>
                        <ul className="list-disc pl-4 text-xs space-y-0.5 text-white/80">
                          {iaResponse.accionesSugeridas.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>
                    )}
                    <div className="text-[10px] text-white/40 mt-2">Motor: {iaResponse.generadoPor}</div>
                  </>
                )}
              </div>
            )}
            {!iaResponse && <div className="text-xs text-white/40 mt-auto pt-2">El asistente usa el motor de IA agnóstico (sin costo). Cambia la lógica en apps/server/services/iaEngineService.js cuando quieras integrar un LLM real.</div>}
          </div>
        </div>

        {/* CONTACTO / WHATSAPP / MAPA - LIMPIO Y ÚTIL */}
        <div className="grid md:grid-cols-5 gap-6 pt-4">
          <div className="md:col-span-3 neon-card p-6">
            <div className="font-semibold mb-1">¿Necesitas ayuda rápida?</div>
            <p className="text-sm text-white/70 mb-4">Chatea directamente con el equipo técnico de {BRAND_NAME}.</p>
            <div className="flex flex-wrap gap-3">
              {['Soporte técnico','Mantenimiento','Desarrollo'].map((txt,i) => (
                <a key={i} href={`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(txt)}`} target="_blank" rel="noreferrer"
                   className="px-5 py-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm transition">
                  {txt}
                </a>
              ))}
              <a href={`https://wa.me/${CONTACT_WHATSAPP}`} target="_blank" rel="noreferrer"
                 className="ml-auto px-6 py-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-400 text-black font-semibold text-sm flex items-center gap-2">
                Abrir WhatsApp →
              </a>
            </div>
          </div>

          <div className="md:col-span-2 neon-card p-6 flex flex-col">
            <div className="font-semibold mb-3">Ubicación</div>
            <div className="text-sm text-white/75">{WORKSHOP_ADDRESS}</div>
            <div className="text-sm text-white/75 mt-0.5">{WORKSHOP_PHONES.join(' · ')}</div>
            <a href="https://maps.app.goo.gl/Mcw71vw36SGgfT7J9" target="_blank" rel="noreferrer"
               className="mt-auto inline-block text-neon-cyan text-sm hover:underline pt-3">Ver en Google Maps →</a>
          </div>
        </div>
      </main>
    </div>
  )
}
