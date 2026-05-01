'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 5 * 60 * 1000

function getLoginAttempts() {
  if (typeof window === 'undefined') return { count: 0, lockedUntil: 0 }
  try {
    const raw = localStorage.getItem('sa_login_attempts')
    return raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 }
  } catch {
    return { count: 0, lockedUntil: 0 }
  }
}

function setLoginAttempts(data) {
  localStorage.setItem('sa_login_attempts', JSON.stringify(data))
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [lockRemaining, setLockRemaining] = useState(0)
  const [shaking, setShaking] = useState(false)
  const formRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      const attempts = getLoginAttempts()
      if (attempts.lockedUntil > Date.now()) {
        setLockRemaining(Math.ceil((attempts.lockedUntil - Date.now()) / 1000))
      } else {
        setLockRemaining(0)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  function showToast(message, type = 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  function triggerShake() {
    setShaking(true)
    setTimeout(() => setShaking(false), 400)
  }

  async function handleLogin(e) {
    e.preventDefault()

    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail || !password) {
      showToast('Preencha todos os campos.')
      return
    }

    const attempts = getLoginAttempts()
    if (attempts.lockedUntil > Date.now()) {
      showToast('Muitas tentativas. Aguarde o desbloqueio.')
      triggerShake()
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    })

    setLoading(false)

    if (error) {
      const newCount = attempts.count + 1
      if (newCount >= MAX_ATTEMPTS) {
        setLoginAttempts({ count: newCount, lockedUntil: Date.now() + LOCKOUT_MS })
        showToast(`Conta bloqueada temporariamente. Tente novamente em 5 minutos.`)
      } else {
        setLoginAttempts({ count: newCount, lockedUntil: 0 })
        showToast(`Credenciais inválidas. ${MAX_ATTEMPTS - newCount} tentativa(s) restante(s).`)
      }
      triggerShake()
      return
    }

    setLoginAttempts({ count: 0, lockedUntil: 0 })
    showToast('Login realizado com sucesso!', 'success')
    setTimeout(() => router.push('/dashboard'), 600)
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="auth-layout">
      {/* Left Panel */}
      <aside className="auth-panel">
        <div className="auth-panel-content">
          <div className="auth-panel-logo">
            <div className="logo-icon">🛡️</div>
            <span>SecureAuth</span>
          </div>
          <h2>Autenticação que você pode confiar.</h2>
          <p>
            Sistema projetado com múltiplas camadas de segurança para proteger seus dados e sua identidade digital.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">🔐</div>
              Senhas criptografadas
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🚫</div>
              Bloqueio por tentativas
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">📡</div>
              Sessões monitoradas
            </div>
          </div>
        </div>
      </aside>

      {/* Right Form */}
      <div className="auth-form-side">
        <div className={`auth-card ${shaking ? 'shake' : ''}`} ref={formRef}>
          <div className="auth-card-mobile-logo">
            <div className="logo-icon">🛡️</div>
            <span>SecureAuth</span>
          </div>

          <h1>Bem-vindo de volta</h1>
          <p className="auth-subtitle">Entre com suas credenciais para acessar o painel.</p>

          {lockRemaining > 0 && (
            <div className="rate-limit-warning">
              🔒 Bloqueado por segurança — desbloqueio em{' '}
              <span className="countdown">{formatTime(lockRemaining)}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="login-email">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  id="login-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="login-password">Senha</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-extra-link">
              <a href="/forgot-password">Esqueci minha senha</a>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || lockRemaining > 0}
            >
              {loading ? <><span className="spinner"></span> Entrando...</> : 'Entrar'}
            </button>
          </form>

          <div className="auth-footer">
            Não tem conta? <a href="/register">Criar conta</a>
          </div>
        </div>
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