'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [elapsed, setElapsed] = useState('')
  const router = useRouter()

  function showToast(message, type = 'info') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    async function init() {
      const { data: { session: currentSession } } = await supabase.auth.getSession()

      if (!currentSession) {
        router.push('/login')
        return
      }

      setUser(currentSession.user)
      setSession(currentSession)
      setLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  // Elapsed time counter
  useEffect(() => {
    if (!session) return

    function updateElapsed() {
      const loginTime = new Date(session.user.last_sign_in_at || Date.now())
      const diff = Math.floor((Date.now() - loginTime.getTime()) / 1000)
      const h = Math.floor(diff / 3600)
      const m = Math.floor((diff % 3600) / 60)
      const s = diff % 60
      if (h > 0) {
        setElapsed(`${h}h ${m}m ${s}s`)
      } else if (m > 0) {
        setElapsed(`${m}m ${s}s`)
      } else {
        setElapsed(`${s}s`)
      }
    }

    updateElapsed()
    const interval = setInterval(updateElapsed, 1000)
    return () => clearInterval(interval)
  }, [session])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="auth-layout">
        <div className="auth-form-side">
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <span className="spinner" style={{ margin: '0 auto' }}></span>
            <p className="auth-subtitle" style={{ marginTop: 16 }}>Verificando sessão...</p>
          </div>
        </div>
      </div>
    )
  }

  const lastLogin = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString('pt-BR')
    : '—'

  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('pt-BR')
    : '—'

  return (
    <div className="dashboard-layout">
      {/* Navbar */}
      <nav className="dash-nav">
        <div className="dash-nav-logo">
          <div className="logo-icon">🛡️</div>
          <span>SecureAuth</span>
        </div>
        <div className="dash-nav-user">
          <span className="dash-user-email">{user?.email}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="dash-content">
        <div className="dash-welcome">
          <h1>Painel Seguro</h1>
          <p>Bem-vindo, {user?.email}</p>
        </div>

        {/* Metric Cards */}
        <div className="dash-cards">
          <div className="dash-card">
            <div className="dash-card-icon">🕐</div>
            <div className="dash-card-label">Último login</div>
            <div className="dash-card-value">{lastLogin}</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-icon">⏱️</div>
            <div className="dash-card-label">Sessão ativa</div>
            <div className="dash-card-value">{elapsed}</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-icon">🛡️</div>
            <div className="dash-card-label">Status</div>
            <div className="dash-card-value">
              <span className="badge badge-success">● Protegido</span>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="dash-section">
          <h2>🔐 Informações da Sessão</h2>
          <div className="dash-info-row">
            <span className="dash-info-label">Email</span>
            <span className="dash-info-value">{user?.email}</span>
          </div>
          <div className="dash-info-row">
            <span className="dash-info-label">Provider</span>
            <span className="dash-info-value">{user?.app_metadata?.provider || 'email'}</span>
          </div>
          <div className="dash-info-row">
            <span className="dash-info-label">Conta criada em</span>
            <span className="dash-info-value">{createdAt}</span>
          </div>
          <div className="dash-info-row">
            <span className="dash-info-label">Verificação de email</span>
            <span className="dash-info-value">
              {user?.email_confirmed_at ? (
                <span className="badge badge-success">✓ Verificado</span>
              ) : (
                <span className="badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                  Pendente
                </span>
              )}
            </span>
          </div>

          <div className="dash-actions">
            <button className="btn-danger-outline" onClick={handleLogout}>
              Encerrar sessão
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="dash-footer">
          SecureAuth © {new Date().getFullYear()} — Sistema de autenticação segura
        </footer>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'} {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}