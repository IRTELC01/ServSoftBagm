import { BRAND_NAME, CONTACT_WHATSAPP, WORKSHOP_PHONES, WORKSHOP_ADDRESS } from '../config'
import { Link } from 'react-router-dom'

export default function Landing() {
  const services = [
    { title: 'Desarrollo a medida', desc: 'Aplicaciones web y APIs para procesos empresariales.', emoji: '🧩', slug: 'desarrollo' },
    { title: 'Integración de sistemas', desc: 'Conecta tu software con ERPs, CRMs y mensajería.', emoji: '🔗', slug: 'integracion' },
    { title: 'Automatización y control', desc: 'Soluciones para parqueaderos y unidades residenciales.', emoji: '⚙️', slug: 'automatizacion' },
    { title: 'Soporte remoto y presencial', desc: 'Diagnóstico, asistencia y resolución de incidencias.', emoji: '🛟', slug: 'soporte' },
    { title: 'Mantenimiento de equipos', desc: 'Computadores, impresoras, tablets y celulares.', emoji: '🖥️', slug: 'mantenimiento' },
    { title: 'Recuperación de información', desc: 'Rescate de datos en discos y memorias.', emoji: '📦', slug: 'recuperacion' },
  ];

  const phonesText = (WORKSHOP_PHONES && WORKSHOP_PHONES.length) ? `Teléfonos: ${WORKSHOP_PHONES.join(', ')}` : 'Atención remota en Colombia y presencial según disponibilidad';
  const addressText = WORKSHOP_ADDRESS ? `Dirección: ${WORKSHOP_ADDRESS}` : '';

  return (
    <main className="max-w-6xl mx-auto px-4 pt-10 pb-24">
      <section className="mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold neon-title-green inline-flex items-center justify-center gap-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--color-neon-green)' }}>
              <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="M7 9h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M7 13h7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M7 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="18" cy="17" r="1.2" fill="currentColor" />
            </svg>
            <span>{BRAND_NAME}</span>
          </h1>
          <p className="mt-3 text-white/80">Soluciones de software e informática: desarrollo, soporte y mantenimiento.</p>
        </div>
        <div className="relative mt-6">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neon-green/30 via-neon-cyan/20 to-neon-pink/20 blur-2xl" />
          <img
            src="/imgWeb1.png"
            alt="Servicios de software y soporte técnico ServSoftBagm"
            className="relative w-full rounded-3xl border border-white/15 shadow-[0_0_60px_rgba(0,255,153,0.30)] object-cover h-64 sm:h-80 md:h-[420px]"
          />
        </div>
      </section>

      

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <Link to={`/servicio/${s.slug}`} key={s.title} className="card-float p-5 hover:scale-[1.01] transition-transform">
            <h3 className="text-lg font-semibold flex items-center gap-2"><span aria-hidden="true">{s.emoji}</span>{s.title}</h3>
            <p className="mt-2 text-sm text-white/80">{s.desc}</p>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30"
                 style={{ background: 'radial-gradient(circle, #ff3cac 0%, #2b86c5 100%)' }} />
          </Link>
        ))}
      </section>

      <section className="mt-12 card-float p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Administrador</h2>
            <p className="text-white/80 text-sm">Acceda para registrar facturas y ver contabilidad.</p>
          </div>
          <a href="/login" className="px-4 py-2 rounded-md bg-neon-cyan/60 hover:bg-neon-cyan/80">Ir al acceso</a>
        </div>
      </section>

      <section className="mt-12 card-float p-6">
        <h3 className="text-lg font-semibold">Casos de uso</h3>
        <ul className="mt-3 text-sm text-white/80 list-disc ml-4">
          <li>Parqueaderos: software de control, reportes y facturación.</li>
          <li>Unidades residenciales: automatización de acceso y registro.</li>
          <li>PYMEs: gestión de servicio, inventario y contabilidad básica.</li>
          <li>Soporte a distancia: asistencia remota segura y eficiente.</li>
          <li>Mantenimiento programado: equipos de oficina y periféricos.</li>
        </ul>
      </section>

      <section className="mt-12 card-float p-6">
        <h3 className="text-lg font-semibold">Contacto y ubicación</h3>
        <p className="mt-2 text-white/80 text-sm">{phonesText}</p>
        {addressText && <p className="text-white/80 text-sm">{addressText}</p>}
        <div className="mt-4 rounded-xl overflow-hidden border border-white/10 aspect-[16/9]">
          <iframe
            title="Ubicación ServSoftBagm en Google Maps"
            src="https://www.google.com/maps?q=Medell%C3%ADn%20Campo%20Vald%C3%A9s&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="https://maps.app.goo.gl/Mcw71vw36SGgfT7J9"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded bg-white/10 hover:bg-white/15 border border-white/20 text-sm"
          >
            <span role="img" aria-label="map">🗺️</span>
            <span>Ver ubicación en Google Maps</span>
          </a>
          {CONTACT_WHATSAPP && (
            <a
              href={`https://wa.me/${CONTACT_WHATSAPP}?text=Hola%20quiero%20informaci%C3%B3n%20de%20servicios`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded bg-neon-cyan/60 hover:bg-neon-cyan/80 border border-white/20 text-sm"
            >
              <span role="img" aria-label="whatsapp">💬</span>
              <span>Hablar por WhatsApp</span>
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
