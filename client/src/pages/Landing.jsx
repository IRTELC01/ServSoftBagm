import { BRAND_NAME, CONTACT_WHATSAPP, WORKSHOP_PHONES, WORKSHOP_ADDRESS } from '../config'

export default function Landing() {
  const services = [
    { title: 'Desarrollo a medida', desc: 'Aplicaciones web y APIs para procesos empresariales.' },
    { title: 'Integración de sistemas', desc: 'Conecta tu software con ERPs, CRMs y mensajería.' },
    { title: 'Automatización y control', desc: 'Soluciones para parqueaderos y unidades residenciales.' },
    { title: 'Soporte remoto y presencial', desc: 'Diagnóstico, asistencia y resolución de incidencias.' },
    { title: 'Mantenimiento de equipos', desc: 'Computadores, impresoras, tablets y celulares.' },
    { title: 'Recuperación de información', desc: 'Rescate de datos en discos y memorias.' },
  ];

  const phonesText = (WORKSHOP_PHONES && WORKSHOP_PHONES.length) ? `Teléfonos: ${WORKSHOP_PHONES.join(', ')}` : 'Atención remota en Colombia y presencial según disponibilidad';
  const addressText = WORKSHOP_ADDRESS ? `Dirección: ${WORKSHOP_ADDRESS}` : '';

  return (
    <main className="max-w-6xl mx-auto px-4 pt-10 pb-24">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold neon-title-green flex items-center justify-center gap-3">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--color-neon-green)' }}>
            <circle cx="8" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
            <circle cx="8" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
            <circle cx="16" cy="12" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <circle cx="16" cy="12" r="3" stroke="currentColor" strokeWidth="2" opacity="0.6" />
          </svg>
          <span>{BRAND_NAME}</span>
        </h1>
        <p className="mt-3 text-white/80">Soluciones de software e informática: desarrollo, soporte y mantenimiento.</p>
      </section>

      <section className="mt-8 card-float p-6">
        <h3 className="text-lg font-semibold">Contacto</h3>
        <p className="mt-2 text-white/80 text-sm">{phonesText}</p>
        {addressText && <p className="text-white/80 text-sm">{addressText}</p>}
        {CONTACT_WHATSAPP && (
          <a
            href={`https://wa.me/${CONTACT_WHATSAPP}?text=Hola%20quiero%20informaci%C3%B3n%20de%20servicios`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded bg-neon-cyan/60 hover:bg-neon-cyan/80 border border-white/20"
          >
            <span role="img" aria-label="whatsapp">💬</span>
            <span>Hablar por WhatsApp</span>
          </a>
        )}
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <article key={s.title} className="card-float p-5">
            <h3 className="text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-white/80">{s.desc}</p>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30"
                 style={{ background: 'radial-gradient(circle, #ff3cac 0%, #2b86c5 100%)' }} />
          </article>
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
    </main>
  );
}
