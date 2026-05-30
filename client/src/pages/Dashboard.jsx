import { useEffect, useMemo, useState } from 'react'
import { createInvoice, listInvoices, getSummary, addTransaction } from '../api'
import { WORKSHOP_NAME, WORKSHOP_PHONES, WORKSHOP_ADDRESS, WORKSHOP_NIT_LABEL, CONTACT_WHATSAPP, BRAND_NAME } from '../config'

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

  const refresh = async () => {
    const inv = await listInvoices(); setInvoices(inv || [])
    const sum = await getSummary(); setSummary(sum || summary)
  }

  useEffect(() => { refresh() }, [])

  const addTx = async (e) => {
    e.preventDefault()
    const r = await addTransaction({ ...tx, amount: Number(tx.amount) })
    if (r.ok) refresh()
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
    localStorage.removeItem('runaway_token')
    window.location.href = '/login'
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
            <div className="hidden md:block px-3 py-1 rounded-full bg-white/5 text-xs border border-white/10">Modo Demo / Producción</div>
          </div>

          <div className="flex items-center gap-2">
            <a href="https://wa.me/573127818103" target="_blank" rel="noreferrer"
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
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-neon-green text-xs tracking-[3px] font-semibold">RESUMEN EN TIEMPO REAL</div>
              <h1 className="text-4xl font-bold tracking-[-1.6px]">Dashboard Financiero</h1>
            </div>
            <div className="text-right hidden md:block text-sm text-white/50">
              {new Date().toLocaleDateString('es-CO', { weekday:'long', day:'numeric', month:'short' })}
            </div>
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

            {/* DONUT CHART */}
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

        {/* SECCIÓN FACTURAS - IMPACTANTE */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-2xl tracking-tight">Facturas emitidas</h3>
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-sm">{filteredInvoices.length} registros</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                value={searchTerm}
                onChange={e=>setSearchTerm(e.target.value)}
                placeholder="Buscar por cliente o nota..."
                className="input-neon text-sm py-2 w-64"
              />
              <button onClick={exportCSV} className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm">Exportar CSV</button>
              <label className="flex items-center gap-2 px-3 text-xs bg-white/5 border border-white/15 rounded-xl cursor-pointer select-none">
                <input type="checkbox" checked={compactView} onChange={e=>setCompactView(e.target.checked)} /> Compacto
              </label>
            </div>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="neon-card p-8 text-center text-white/60">No hay facturas que coincidan. ¡Crea tu primera factura arriba!</div>
          )}

          <div className={`grid gap-4 ${compactView ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
            {filteredInvoices.map(inv => {
              const consec = String((inv.consecutive ?? (inv.id-1)%10000)).padStart(4,'0')
              const pay = (inv.payment_method || 'efectivo').toLowerCase()
              const payClass = pay.includes('tarj') ? 'pay-tarjeta' : pay.includes('trans') ? 'pay-transferencia' : 'pay-efectivo'

              return (
                <div key={inv.id} className="inv-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-neon-green text-sm tracking-[1px]">#{consec}</div>
                      <div className="font-semibold text-lg leading-tight">{inv.customer_name || 'Cliente sin nombre'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold tabular-nums">${Number(inv.total).toLocaleString()}</div>
                      <div className="text-[10px] text-white/50">{inv.date?.slice(0,10)}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center mt-1">
                    <span className={`pay-badge ${payClass}`}>{inv.payment_method || 'efectivo'}</span>
                    {Number(inv.vat_amount) > 0 && <span className="text-[10px] px-2 py-px rounded bg-white/5 border border-white/10">IVA ${Number(inv.vat_amount).toLocaleString()}</span>}
                  </div>

                  {!compactView && inv.line_items && inv.line_items.length > 0 && (
                    <div className="mt-2 text-xs text-white/70 leading-snug border-l border-white/10 pl-3">
                      {inv.line_items.slice(0,2).map((li,idx) => (
                        <div key={idx}>{li.name} ×{li.qty} — ${Number(li.price).toLocaleString()}</div>
                      ))}
                      {inv.line_items.length > 2 && <div className="text-white/40">+{inv.line_items.length-2} más...</div>}
                    </div>
                  )}

                  <div className="mt-auto pt-3 flex gap-2">
                    <button
                      onClick={() => {
                        const lines = [
                          `${WORKSHOP_NAME}`, `Tel: ${WORKSHOP_PHONES.join(', ')}`, `${WORKSHOP_NIT_LABEL}`, WORKSHOP_ADDRESS,
                          '', `FACTURA #${consec}`, `Fecha: ${inv.date}`, `Cliente: ${inv.customer_name||''}`, `Dir: ${inv.address||''}`, `Tel: ${inv.phone||''}`, '',
                          ... (inv.line_items||[]).map(li => `• ${li.name} x${li.qty} $${Number(li.price).toLocaleString()}`),
                          `Mano de obra: $${Number(inv.labor_cost||0).toLocaleString()}`, `Subtotal: $${Number(inv.subtotal||0).toLocaleString()}`, `IVA: $${Number(inv.vat_amount||0).toLocaleString()}`, `TOTAL: $${Number(inv.total).toLocaleString()}`
                        ]
                        const blob = new Blob([lines.join('\n')], {type:'text/plain;charset=utf-8'})
                        const url = URL.createObjectURL(blob)
                        const a=document.createElement('a'); a.href=url; a.download=`Factura_${consec}.txt`; a.click(); URL.revokeObjectURL(url)
                      }}
                      className="flex-1 py-2 text-xs rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 active:bg-white/15"
                    >
                      Descargar .txt
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(String(inv.total)); alert('Total copiado') }} className="px-4 py-2 text-xs rounded-xl border border-white/20 hover:bg-white/10">Copiar $</button>
                  </div>
                </div>
              )
            })}
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
