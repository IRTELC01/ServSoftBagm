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
          <h1 className="text-4xl md:text-5xl font-extrabold neon-title-green inline-flex items-center justify-center gap-3 drop-shadow-lg">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--color-neon-green)' }}>
              <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="M7 9h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M7 13h7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M7 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="18" cy="17" r="1.2" fill="currentColor" />
            </svg>
            <span>{BRAND_NAME}</span>
          </h1>
          <p className="mt-3 text-white/90 text-lg">Soluciones de software e informática: desarrollo, soporte y mantenimiento.</p>
        </div>
        {/* Hero principal con imagen - Más atractivo y profesional */}
        <div className="relative mt-6 rounded-3xl overflow-hidden border border-white/15 h-64 sm:h-80 md:h-[420px]">
          <img 
            src="/imgWeb1.png" 
            alt="ServSoftBagm - Soluciones de software e informática" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Overlay oscuro + gradiente para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
          
          <div className="relative h-full flex flex-col justify-center px-8 md:px-12 text-white">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-neon-green flex items-center justify-center">
                  <span className="text-black font-black text-3xl tracking-tighter">S</span>
                </div>
                <span className="text-4xl md:text-5xl font-bold tracking-[-1.5px] text-white drop-shadow-lg">
                  {BRAND_NAME}
                </span>
              </div>

              <h2 className="text-2xl md:text-4xl font-semibold leading-tight tracking-tight mb-3">
                Soluciones de software e informática<br />que realmente funcionan
              </h2>
              
              <p className="text-lg md:text-xl text-white/90 max-w-lg">
                Desarrollo a medida • Soporte técnico • Mantenimiento • Automatización
              </p>
            </div>
          </div>
        </div>
      </section>

      

      {/* Sección de Servicios - Estilo Futurista con fondo iluminado */}
      <div className="relative py-8">
        {/* Fondo iluminado grande que contrasta fuertemente con el neon verde */}
        <div 
          className="absolute inset-0 -mx-6 rounded-3xl opacity-70 blur-[80px]"
          style={{
            background: 'radial-gradient(circle at 50% 30%, rgba(57,255,20,0.35) 0%, rgba(43,134,197,0.18) 45%, transparent 75%)'
          }}
        />

        <section className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link 
              to={`/servicio/${s.slug}`} 
              key={s.title} 
              className="card-float p-6 hover:scale-[1.03] hover:border-neon-green hover:shadow-[0_0_25px_rgba(57,255,20,0.3)] transition-all duration-300 group"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl mt-0.5 group-hover:scale-110 transition-transform">{s.emoji}</span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm text-white/75 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>

      {/* Información de contacto más visible y arriba */}
      <section className="mt-10 card-float p-6 border border-white/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">¿Necesitas ayuda o información?</h3>
            <p className="text-white/80 mt-1">Escríbenos directamente:</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <a 
              href="mailto:servsoftbagm@gmail.com" 
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-sm font-medium flex items-center gap-2"
            >
              ✉️ servsoftbagm@gmail.com
            </a>
            {CONTACT_WHATSAPP && (
              <a 
                href={`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent('Hola, me interesa conocer más sobre sus servicios')}`} 
                target="_blank" 
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/40 text-sm font-medium flex items-center gap-2 text-neon-green"
              >
                💬 WhatsApp directo
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Casos de uso - Enfoque honesto y educativo */}
      <section className="mt-12 card-float p-5">
        <h3 className="text-lg font-semibold mb-3">Escenarios comunes de aplicación</h3>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <a href="https://n8n.io/" target="_blank" rel="noreferrer" className="text-white/80 hover:text-neon-cyan hover:underline">→ Automatización de procesos en empresas</a>
          <a href="https://airbyte.com/" target="_blank" rel="noreferrer" className="text-white/80 hover:text-neon-cyan hover:underline">→ Integración de datos y sincronización</a>
          <a href="https://www.home-assistant.io/" target="_blank" rel="noreferrer" className="text-white/80 hover:text-neon-cyan hover:underline">→ Automatización residencial y control de acceso</a>
          <a href="https://grafana.com/" target="_blank" rel="noreferrer" className="text-white/80 hover:text-neon-cyan hover:underline">→ Monitoreo y observabilidad de sistemas</a>
          <a href="https://www.twilio.com/" target="_blank" rel="noreferrer" className="text-white/80 hover:text-neon-cyan hover:underline">→ Comunicación y notificaciones automatizadas</a>
          <a href="https://www.postgresql.org/" target="_blank" rel="noreferrer" className="text-white/80 hover:text-neon-cyan hover:underline">→ Bases de datos y gestión de información</a>
        </div>
        <p className="mt-3 text-xs text-white/50">Ejemplos de tecnologías y escenarios donde se aplican soluciones similares.</p>
      </section>

      <section className="mt-8 card-float p-5">
        <h3 className="text-lg font-semibold">Contacto y ubicación</h3>
        <p className="mt-2 text-white/80 text-sm">{phonesText}</p>
        {addressText && <p className="text-white/80 text-sm">{addressText}</p>}
        <p className="mt-1 text-sm">
          <a href="mailto:servsoftbagm@gmail.com" className="text-neon-cyan hover:underline font-medium">
            servsoftbagm@gmail.com
          </a>
        </p>
        <div className="mt-4 rounded-xl overflow-hidden border border-white/10 h-56">
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
              href={`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent('menu')}`}
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
