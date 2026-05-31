import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BRAND_NAME, CONTACT_WHATSAPP } from '../config'

export default function Service() {
  const { slug } = useParams()
  const data = useMemo(() => {
    const base = {
      desarrollo: {
        title: 'Desarrollo a medida',
        emoji: '🧩',
        desc: 'Diseñamos y construimos aplicaciones web y APIs alineadas a tus procesos, integrando seguridad, rendimiento y escalabilidad.',
        features: ['Análisis y modelado de procesos', 'Arquitectura modular y APIs REST/GraphQL', 'UI/UX con enfoque productivo', 'Pruebas y despliegue automatizado', 'Integración con sistemas existentes'],
        gallery: ['/Imagen2.png', '/Imagen3.png', '/Imagen4.png'],
      },
      integracion: {
        title: 'Integración de sistemas',
        emoji: '🔗',
        desc: 'Conectamos tus herramientas y plataformas: ERPs, CRMs, mensajería y servicios cloud para que la información fluya sin fricción.',
        features: ['Conectores y ETL ligeros', 'Sincronización bidireccional', 'Webhooks y mensajería (WhatsApp, email)', 'Observabilidad y monitoreo', 'Seguridad y trazabilidad de datos'],
        gallery: ['/Imagen16.png', '/Imagen6.png', '/Imagen7.png'],
      },
      automatizacion: {
        title: 'Automatización y control',
        emoji: '⚙️',
        desc: 'Automatizamos procesos con dispositivos embebidos e integración de control para parqueaderos, unidades residenciales y entornos operativos.',
        features: ['Diseño de flujo y dispositivos', 'Integración de acceso y registro', 'Paneles de control y alertas', 'Logística y trazabilidad operacional', 'Soporte e instalación'],
        gallery: ['/Imagen9.png', '/Imagen10.png', '/Imagen11.png'],
      },
      soporte: {
        title: 'Soporte remoto y presencial',
        emoji: '🛟',
        desc: 'Diagnosticamos, asistimos y resolvemos incidencias de forma remota o presencial, con tiempos de respuesta claros.',
        features: ['Diagnóstico guiado', 'Asistencia remota segura', 'Visitas en sitio', 'Documentación y recomendaciones', 'Planes de soporte'],
        gallery: ['/Imagen12.png', '/Imagen5.png', '/Imagen14.png'],
      },
      mantenimiento: {
        title: 'Mantenimiento de equipos',
        emoji: '🖥️',
        desc: 'Mantenemos computadores, impresoras, tablets y celulares: limpieza, actualización, reparación y optimización.',
        features: ['Mantenimiento preventivo y correctivo', 'Actualización de software y drivers', 'Reemplazo de partes', 'Optimización de rendimiento', 'Checklist y reporte'],
        gallery: ['/Imagen17.png', '/Imagen10.png', '/Imagen18.png'],
      },
      recuperacion: {
        title: 'Recuperación de información',
        emoji: '📦',
        desc: 'Recuperamos información en discos y memorias con protocolos de mínima intervención y preservación de evidencia.',
        features: ['Diagnóstico del medio', 'Clonado y extracción de datos', 'Recuperación por particiones', 'Informe y recomendaciones', 'Opciones de respaldo'],
        gallery: ['/Imagen13.png', '/Imagen19.png', '/Imagen11.png'],
      },
    }
    return base[slug] || { title: 'Servicio', emoji: '💡', desc: 'Detalle del servicio.', gallery: [] }
  }, [slug])

  return (
    <main className="max-w-6xl mx-auto px-4 pt-10 pb-24 relative">
      {/* Fondo futurista sutil para las páginas de servicio */}
      <div 
        className="absolute inset-0 -z-10 opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(57,255,20,0.12) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(43,134,197,0.1) 0%, transparent 60%)'
        }}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold neon-title-green flex items-center gap-2">
          <span aria-hidden="true">{data.emoji}</span>
          <span>{data.title}</span>
        </h1>
        <Link to="/" className="text-sm text-neon-cyan hover:underline">Volver</Link>
      </div>
      <p className="mt-2 text-white/80">{data.desc}</p>
      {data.features && (
        <div className="mt-4 card-float p-5 border border-white/10">
          <h3 className="font-semibold mb-2">Incluye</h3>
          <ul className="space-y-1.5 text-sm">
            {data.features.map((feature, i) => {
              // Enlaces reales y serios según el tipo de feature
              const links = {
                'Conectores y ETL ligeros': 'https://airbyte.com/',
                'Sincronización bidireccional': 'https://firebase.google.com/docs/firestore/solutions/offline',
                'Webhooks y mensajería (WhatsApp, email)': 'https://developers.facebook.com/docs/whatsapp/cloud-api',
                'Observabilidad y monitoreo': 'https://grafana.com/',
                'Seguridad y trazabilidad de datos': 'https://owasp.org/',
                'Análisis y modelado de procesos': 'https://www.bpmn.org/',
                'Arquitectura modular y APIs REST/GraphQL': 'https://graphql.org/',
                'UI/UX con enfoque productivo': 'https://www.nngroup.com/',
                'Pruebas y despliegue automatizado': 'https://www.cypress.io/',
                'Integración con sistemas existentes': 'https://n8n.io/',
                'Diseño de flujo y dispositivos': 'https://www.arduino.cc/',
                'Integración de acceso y registro': 'https://www.home-assistant.io/',
                'Paneles de control y alertas': 'https://grafana.com/',
                'Logística y trazabilidad operacional': 'https://www.odoo.com/',
                'Soporte e instalación': 'https://www.home-assistant.io/',
                'Diagnóstico guiado': 'https://www.teamviewer.com/',
                'Asistencia remota segura': 'https://anydesk.com/',
                'Visitas en sitio': 'https://www.teamviewer.com/',
                'Documentación y recomendaciones': 'https://docs.microsoft.com/',
                'Planes de soporte': 'https://www.zendesk.com/',
                'Mantenimiento preventivo y correctivo': 'https://www.dell.com/support/home',
                'Actualización de software y drivers': 'https://www.intel.com/content/www/us/en/support.html',
                'Reemplazo de partes': 'https://www.ifixit.com/',
                'Optimización de rendimiento': 'https://www.passmark.com/',
                'Checklist y reporte': 'https://www.atlassian.com/software/confluence',
                'Diagnóstico del medio': 'https://www.easeus.com/datarecoverywizard/',
                'Clonado y extracción de datos': 'https://www.clonezilla.org/',
                'Recuperación por particiones': 'https://www.cgsecurity.org/wiki/TestDisk',
                'Informe y recomendaciones': 'https://www.sleuthkit.org/',
                'Opciones de respaldo': 'https://www.backblaze.com/',
              };

              const url = links[feature] || '#';

              return (
                <li key={i}>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-white/80 hover:text-neon-cyan hover:underline transition-colors"
                  >
                    {feature} →
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.gallery.map((src, i) => (
          <div key={i} className="relative rounded-2xl overflow-hidden border border-white/15 bg-white/5 hover:border-neon-cyan/40 transition-all group">
            <img src={src} alt={data.title} className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ))}
      </div>
      {CONTACT_WHATSAPP && (
        <a
          href={`https://wa.me/${CONTACT_WHATSAPP}?text=${
            encodeURIComponent(
              slug === 'desarrollo' ? 'desarrollo' :
              slug === 'soporte' ? 'soporte' :
              slug === 'mantenimiento' ? 'mantenimiento' :
              slug === 'recuperacion' ? 'recuperacion' :
              'menu'
            )
          }`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded bg-neon-cyan/60 hover:bg-neon-cyan/80 border border-white/20"
        >
          <span role="img" aria-label="whatsapp">💬</span>
          <span>Solicitar información</span>
        </a>
      )}
    </main>
  )
}
