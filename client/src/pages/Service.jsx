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
        gallery: [
          'https://source.unsplash.com/featured/?code,programming,neon&sig=1',
          'https://source.unsplash.com/featured/?software,developer,cyberpunk&sig=2',
          'https://source.unsplash.com/featured/?keyboard,code,glow&sig=3',
        ],
      },
      integracion: {
        title: 'Integración de sistemas',
        emoji: '🔗',
        desc: 'Conectamos tus herramientas y plataformas: ERPs, CRMs, mensajería y servicios cloud para que la información fluya sin fricción.',
        features: ['Conectores y ETL ligeros', 'Sincronización bidireccional', 'Webhooks y mensajería (WhatsApp, email)', 'Observabilidad y monitoreo', 'Seguridad y trazabilidad de datos'],
        gallery: [
          'https://source.unsplash.com/featured/?network,connection,neon&sig=4',
          'https://source.unsplash.com/featured/?data,mesh,abstract&sig=5',
          'https://source.unsplash.com/featured/?api,integration,system&sig=6',
        ],
      },
      automatizacion: {
        title: 'Automatización y control',
        emoji: '⚙️',
        desc: 'Automatizamos procesos con dispositivos embebidos e integración de control para parqueaderos, unidades residenciales y entornos operativos.',
        features: ['Diseño de flujo y dispositivos', 'Integración de acceso y registro', 'Paneles de control y alertas', 'Logística y trazabilidad operacional', 'Soporte e instalación'],
        gallery: [
          'https://source.unsplash.com/featured/?automation,embedded,control&sig=7',
          'https://source.unsplash.com/featured/?industrial,controller,neon&sig=8',
          'https://source.unsplash.com/featured/?robotics,plc,iot&sig=9',
        ],
      },
      soporte: {
        title: 'Soporte remoto y presencial',
        emoji: '🛟',
        desc: 'Diagnosticamos, asistimos y resolvemos incidencias de forma remota o presencial, con tiempos de respuesta claros.',
        features: ['Diagnóstico guiado', 'Asistencia remota segura', 'Visitas en sitio', 'Documentación y recomendaciones', 'Planes de soporte'],
        gallery: [
          'https://source.unsplash.com/featured/?helpdesk,remote,technology&sig=10',
          'https://source.unsplash.com/featured/?support,call,monitor&sig=11',
          'https://source.unsplash.com/featured/?remote,assist,pc&sig=12',
        ],
      },
      mantenimiento: {
        title: 'Mantenimiento de equipos',
        emoji: '🖥️',
        desc: 'Mantenemos computadores, impresoras, tablets y celulares: limpieza, actualización, reparación y optimización.',
        features: ['Mantenimiento preventivo y correctivo', 'Actualización de software y drivers', 'Reemplazo de partes', 'Optimización de rendimiento', 'Checklist y reporte'],
        gallery: [
          'https://source.unsplash.com/featured/?computer,repair,maintenance&sig=13',
          'https://source.unsplash.com/featured/?tools,pc,service&sig=14',
          'https://source.unsplash.com/featured/?hardware,device,fix&sig=15',
        ],
      },
      recuperacion: {
        title: 'Recuperación de información',
        emoji: '📦',
        desc: 'Recuperamos información en discos y memorias con protocolos de mínima intervención y preservación de evidencia.',
        features: ['Diagnóstico del medio', 'Clonado y extracción de datos', 'Recuperación por particiones', 'Informe y recomendaciones', 'Opciones de respaldo'],
        gallery: [
          'https://source.unsplash.com/featured/?data,recovery,storage&sig=16',
          'https://source.unsplash.com/featured/?server,disk,backup&sig=17',
          'https://source.unsplash.com/featured/?cloud,restore,security&sig=18',
        ],
      },
    }
    return base[slug] || { title: 'Servicio', emoji: '💡', desc: 'Detalle del servicio.', gallery: ['/imgWeb1.png'] }
  }, [slug])

  return (
    <main className="max-w-6xl mx-auto px-4 pt-10 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold neon-title-green flex items-center gap-2">
          <span aria-hidden="true">{data.emoji}</span>
          <span>{data.title}</span>
        </h1>
        <Link to="/" className="text-sm text-neon-cyan hover:underline">Volver</Link>
      </div>
      <p className="mt-2 text-white/80">{data.desc}</p>
      {data.features && (
        <div className="mt-4 card-float p-4">
          <h3 className="font-semibold">Incluye</h3>
          <ul className="mt-2 text-sm text-white/80 list-disc ml-5">
            {data.features.map((f, i) => (<li key={i}>{f}</li>))}
          </ul>
        </div>
      )}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.gallery.map((src, i) => (
          <div key={i} className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <img src={src} alt={data.title} className="w-full h-48 object-cover" />
          </div>
        ))}
      </div>
      {CONTACT_WHATSAPP && (
        <a
          href={`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent('Hola, quiero información de ' + data.title + ' en ' + BRAND_NAME)}`}
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
