import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import './index.css'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Setup2FA from './pages/Setup2FA'
import Dashboard from './pages/Dashboard'
import LoginPhone from './pages/LoginPhone'
import Service from './pages/Service'
import WhatsAppButton from './components/WhatsAppButton'
import Chatbot from './components/Chatbot'
import ClientPortal from './pages/ClientPortal'
import { BRAND_NAME, CONTACT_EMAIL, CONTACT_WHATSAPP } from './config'
import { BANK_QR_PATH, BANK_TRANSFER } from './config/bank'

function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-black/40 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--color-neon-green)' }}>
            <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
            <path d="M7 9h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 13h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="18" cy="17" r="1.2" fill="currentColor" />
          </svg>
          <span className="neon-title-green">{BRAND_NAME}</span>
        </Link>
        <nav className="flex gap-4 text-sm text-white/90">
          <Link to="/" className="hover:text-white">Inicio</Link>
          <Link to="/cliente" className="hover:text-white">Portal Cliente</Link>
          <Link to="/login" className="hover:text-white">Acceso Admin</Link>
        </nav>
      </div>
    </header>
  )
}

function QRBreBModal({ open, onClose }) {
  if (!open) return null

  const copyAll = () => {
    const parts = []
    if (BANK_TRANSFER.llaveBreB) parts.push(`Llave BreB: ${BANK_TRANSFER.llaveBreB}`)
    if (BANK_TRANSFER.numeroCuenta) parts.push(`Cuenta: ${BANK_TRANSFER.numeroCuenta}`)
    if (BANK_TRANSFER.titular) parts.push(`Titular: ${BANK_TRANSFER.titular}`)
    if (BANK_TRANSFER.banco) parts.push(`Banco: ${BANK_TRANSFER.banco}`)
    navigator.clipboard.writeText(parts.join('\n'))
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0f1324] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-neon-green">Contribución voluntaria</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white text-xl leading-none transition-colors" aria-label="Cerrar">✕</button>
        </div>

        <div className="flex justify-center mb-5">
          <div className="bg-white rounded-xl p-3">
            <img src={BANK_QR_PATH} alt="QR BreB" className="w-52 h-52 object-contain" style={{ imageRendering: 'pixelated' }} />
          </div>
        </div>

        <div className="space-y-2 text-sm mb-5">
          {BANK_TRANSFER.llaveBreB && (
            <div className="flex justify-between items-center gap-3">
              <span className="text-white/50 shrink-0">Llave BreB</span>
              <span className="text-white font-mono text-right truncate">{BANK_TRANSFER.llaveBreB}</span>
            </div>
          )}
          {BANK_TRANSFER.numeroCuenta && (
            <div className="flex justify-between items-center gap-3">
              <span className="text-white/50 shrink-0">Cuenta</span>
              <span className="text-white font-mono text-right truncate">{BANK_TRANSFER.numeroCuenta}</span>
            </div>
          )}
          {BANK_TRANSFER.titular && (
            <div className="flex justify-between items-center gap-3">
              <span className="text-white/50 shrink-0">Titular</span>
              <span className="text-white text-right truncate">{BANK_TRANSFER.titular}</span>
            </div>
          )}
          {BANK_TRANSFER.banco && (
            <div className="flex justify-between items-center gap-3">
              <span className="text-white/50 shrink-0">Banco</span>
              <span className="text-white text-right truncate">{BANK_TRANSFER.banco}</span>
            </div>
          )}
        </div>

        <button
          onClick={copyAll}
          className="w-full py-2.5 bg-neon-green/20 border border-neon-green/40 text-neon-green rounded-lg hover:bg-neon-green/30 active:scale-[0.98] transition-all text-sm font-medium cursor-pointer"
        >
          Copiar datos
        </button>
      </div>
    </div>
  )
}

function Footer({ onQRClick }) {
  return (
    <footer className="footer-group fixed bottom-0 left-0 right-0 z-40 bg-black/60 backdrop-blur border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between text-sm">
        <span className="neon-text text-neon-green">Soluciones de software e informática</span>
        <div className="flex items-center gap-4">
          <a href="mailto:servsoftbagm@gmail.com" className="neon-text text-neon-cyan hover:underline text-sm">
            servsoftbagm@gmail.com
          </a>
          {CONTACT_WHATSAPP && <a href={`https://wa.me/${CONTACT_WHATSAPP}?text=Hola%20vi%20tu%20contacto%20en%20${encodeURIComponent(BRAND_NAME)}`} target="_blank" rel="noreferrer" className="neon-text text-neon-green hover:underline text-sm">WhatsApp</a>}
        </div>
      </div>

      {/* Apoya el desarrollo — auto-hide on desktop */}
      <div className="auto-hide-bar border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center gap-4 text-xs text-white/50">
          <div className="flex-1 text-center sm:text-left">
            <span className="text-neon-green font-medium">Apoya el desarrollo de {BRAND_NAME}</span>
            <p className="mt-0.5">
              Plataforma independiente en evolución. Si esta herramienta te resulta útil
              y deseas apoyar su mantenimiento y crecimiento, puedes hacerlo mediante una contribución voluntaria.
            </p>
          </div>
          <button
            onClick={onQRClick}
            className="bg-white rounded-xl p-2 shrink-0 sm:mr-36 cursor-pointer hover:ring-2 hover:ring-neon-green/40 transition-all"
            aria-label="Ver datos de contribución"
          >
            <img src={BANK_QR_PATH} alt="QR BreB – Toca para ver datos" className="w-16 h-16 object-contain" style={{ imageRendering: 'pixelated' }} />
          </button>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppButtonWrapper() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/login') ||
                      location.pathname.startsWith('/register') ||
                      location.pathname.startsWith('/setup-2fa')

  if (isAdminPage) return null
  return <WhatsAppButton />
}

export default function App() {
  const [qrModalOpen, setQrModalOpen] = useState(false)

  function RequireAuth({ children }) {
    const openAccess = String(import.meta.env.VITE_OPEN_ACCESS) === 'true'
    const token = localStorage.getItem('servsoftbagm_token')
    const urlParams = new URLSearchParams(window.location.search);
    const justLoggedOut = urlParams.get('loggedOut') === 'true';

    // Si venimos de un logout explícito, forzamos ir al login
    if (justLoggedOut) {
      return <Navigate to="/login?loggedOut=true" replace />;
    }

    // Si OPEN_ACCESS está activo, permitimos todo (solo desarrollo)
    if (openAccess) return children;

    if (!token) return <Navigate to="/login" replace />;
    return children
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-future text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-phone" element={<LoginPhone />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setup-2fa" element={<Setup2FA />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/servicio/:slug" element={<Service />} />
          <Route path="/cliente" element={<ClientPortal />} />
        </Routes>
        <Footer onQRClick={() => setQrModalOpen(true)} />

        {/* Floating WhatsApp Button - only on public pages */}
        <WhatsAppButtonWrapper />

        {/* Chatbot básico profesional - solo páginas públicas */}
        <Chatbot />

        {/* QR BreB Modal */}
        <QRBreBModal open={qrModalOpen} onClose={() => setQrModalOpen(false)} />
      </div>
    </BrowserRouter>
  )
}
