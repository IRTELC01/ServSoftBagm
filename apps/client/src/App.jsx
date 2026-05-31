import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
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
import { login, register, setToken } from './api'
import { BRAND_NAME, CONTACT_EMAIL, CONTACT_WHATSAPP } from './config'

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

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-black/60 backdrop-blur border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between text-sm">
        <span className="neon-text text-neon-green">Soluciones de software e informática</span>
        <div className="flex items-center gap-4">
          <a href="mailto:servsoftbagm@gmail.com" className="neon-text text-neon-cyan hover:underline text-sm">
            servsoftbagm@gmail.com
          </a>
          {CONTACT_WHATSAPP && <a href={`https://wa.me/${CONTACT_WHATSAPP}?text=Hola%20vi%20tu%20contacto%20en%20${encodeURIComponent(BRAND_NAME)}`} target="_blank" rel="noreferrer" className="neon-text text-neon-green hover:underline text-sm">WhatsApp</a>}
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
  // Auto-login global (solo dev): intenta admin/servsoft123 y registra si hace falta
  useEffect(() => {
    const run = async () => {
      // En producción sólo auto-login si está habilitado explícitamente
      if (import.meta.env.PROD && String(import.meta.env.VITE_OPEN_ACCESS) !== 'true') return
      const hasToken = !!localStorage.getItem('runaway_token')
      if (hasToken) return
      try {
        let r = await login('admin', 'servsoft123', '')
        if (!r.token) { await register('admin', 'servsoft123'); r = await login('admin', 'servsoft123', '') }
        if (r.token) { setToken(r.token) }
      } catch { void 0 }
    }
    run()
  }, [])

  function RequireAuth({ children }) {
    const openAccess = String(import.meta.env.VITE_OPEN_ACCESS) === 'true'
    const token = localStorage.getItem('runaway_token')
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
        <Footer />

        {/* Floating WhatsApp Button - only on public pages */}
        <WhatsAppButtonWrapper />

        {/* Chatbot básico profesional - solo páginas públicas */}
        <Chatbot />
      </div>
    </BrowserRouter>
  )
}
