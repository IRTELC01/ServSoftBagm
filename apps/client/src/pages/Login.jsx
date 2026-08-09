import { useEffect, useState } from 'react'
import { login, register, setToken } from '../api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('Verificando credenciales...')
    try {
      const r = await login(username, password, code)
      if (r.token) {
        setToken(r.token)
        setMsg('Acceso concedido')
        window.location.href = '/dashboard'
      } else {
        setMsg(r.error || 'Error de acceso. Revisa usuario, contraseña o código 2FA.')
      }
    } catch (err) {
      console.error('Error en login:', err)
      setMsg('No se pudo conectar con el servidor. ¿Está corriendo el backend en puerto 3001?')
    }
  }

  // Automatizar acceso: intenta login y, si falla, registra y vuelve a intentar
  const autoLogin = async () => {
    try {
      setMsg('Intentando acceso automático...')
      let r = await login(username, password, '')
      if (!r.token) {
        const reg = await register(username, password)
        if (reg.error) {
          setMsg(reg.error)
          return
        }
        r = await login(username, password, '')
      }
      if (r.token) {
        setToken(r.token)
        setMsg('Acceso automático concedido')
        window.location.href = '/dashboard'
      } else {
        setMsg(r.error || 'No se pudo acceder automáticamente')
      }
    } catch (err) {
      console.error('Error en autoLogin:', err)
      setMsg('No se pudo conectar con el servidor (¿backend en 3001?).')
    }
  }

  useEffect(() => {
    const isProd = import.meta.env.MODE === 'production'
    const hasToken = !!localStorage.getItem('runaway_token')
    if (!isProd && !hasToken) autoLogin()
  }, [])

  const urlParams = new URLSearchParams(window.location.search);
  const justLoggedOut = urlParams.get('loggedOut') === 'true';

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Acceso Administrador</h2>

      {justLoggedOut && (
        <div className="mb-4 p-3 rounded-xl bg-neon-pink/10 border border-neon-pink/30 text-sm text-neon-pink">
          Sesión cerrada correctamente. Por seguridad, vuelve a iniciar sesión.
        </div>
      )}
      <form onSubmit={onSubmit} className="card-float p-4 space-y-3">
        <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" placeholder="Usuario"
               value={username} onChange={e=>setUsername(e.target.value)} />
        <input type="password" className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" placeholder="Contraseña"
               value={password} onChange={e=>setPassword(e.target.value)} />
        <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" placeholder="Código 2FA (opcional)"
               value={code} onChange={e=>setCode(e.target.value)} />
        <p className="text-xs text-white/60">Déjalo vacío si no configuraste 2FA. Si lo tienes, usa el código de 6 dígitos generado por tu app.</p>
        <button className="w-full px-3 py-2 rounded bg-neon-pink/60 hover:bg-neon-pink/80">Ingresar</button>
        <button type="button" onClick={autoLogin} className="w-full px-3 py-2 rounded bg-neon-cyan/60 hover:bg-neon-cyan/80">Acceso automático</button>
      </form>
      {msg && <p className="mt-3 text-sm text-white/80">{msg}</p>}
      <div className="mt-3 text-xs text-white/60 flex gap-3">
        <a href="/register">Registrar</a>
        <a href="/setup-2fa">Configurar 2FA</a>
      </div>
    </main>
  )
}
