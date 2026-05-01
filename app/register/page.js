'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

function getPasswordStrength(pw) {
  if (!pw) return { level: '', label: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 1) return { level: 'weak', label: 'Fraca' }
  if (score <= 2) return { level: 'medium', label: 'Média' }
  return { level: 'strong', label: 'Forte' }
}

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const strength = getPasswordStrength(password)

  function showToast(message, type = 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleRegister(e) {
    e.preventDefault()

    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedEmail || !password || !confirmPassword) {
      showToast('Preencha todos os campos.')
      return
    }

    if (password.length < 8) {
      showToast('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      showToast('As senhas não coincidem.')
      return
    }

    if (strength.level === 'weak') {
      showToast('Escolha uma senha mais forte (maiúscula, número e caractere especial).')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
    })

    setLoading(false)

    if (error) {
      showToast(`Erro ao registrar: ${error.message}`)
      return
    }

    showToast('Conta criada com sucesso! Verifique seu e-mail.', 'success')
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
          <h2>Crie sua conta segura.</h2>
          <p>
            Sua senha é criptografada e nunca armazenada em texto puro. Segurança desde o primeiro passo.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">🔑</div>
              Criptografia de ponta
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">✅</div>
              Validação em tempo real
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🛡️</div>
              Proteção contra ataques
            </div>
          </div>
        </div>
      </aside>

      {/* Right Form */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-card-mobile-logo">
            <div className="logo-icon">🛡️</div>
            <span>SecureAuth</span>
          </div>

          <h1>Criar conta</h1>
          <p className="auth-subtitle">Cadastre-se para acessar o ambiente protegido.</p>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="input-group">
              <label htmlFor="reg-email">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="reg-password">Senha</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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
              {password && (
                <div className="password-strength">
                  <div className="strength-bar-track">
                    <div className={`strength-bar-fill ${strength.level}`}></div>
                  </div>
                  <div className={`strength-label ${strength.level}`}>{strength.label}</div>
                </div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="reg-confirm">Confirmar senha</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="reg-confirm"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <div className="strength-label weak" style={{ marginTop: 6 }}>
                  As senhas não coincidem
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? <><span className="spinner"></span> Registrando...</> : 'Criar conta'}
            </button>
          </form>

          <div className="auth-footer">
            Já tem conta? <a href="/login">Entrar</a>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.type === 'success' ? '✅' : '❌'} {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}