'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [sent, setSent] = useState(false)

  function showToast(message, type = 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleReset(e) {
    e.preventDefault()

    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail) {
      showToast('Informe seu email.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: `${window.location.origin}/login`,
    })

    setLoading(false)

    if (error) {
      showToast(`Erro: ${error.message}`)
      return
    }

    setSent(true)
    showToast('Email de recuperação enviado! Verifique sua caixa de entrada.', 'success')
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
          <h2>Recupere o acesso à sua conta.</h2>
          <p>
            Enviaremos um link seguro para o seu email. 
            Basta clicar e definir uma nova senha.
          </p>
        </div>
      </aside>

      {/* Right Form */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-card-mobile-logo">
            <div className="logo-icon">🛡️</div>
            <span>SecureAuth</span>
          </div>

          <h1>Esqueci minha senha</h1>
          <p className="auth-subtitle">
            {sent
              ? 'Verifique seu email e siga as instruções para redefinir a senha.'
              : 'Informe o email da sua conta para receber o link de recuperação.'}
          </p>

          {!sent && (
            <form className="auth-form" onSubmit={handleReset}>
              <div className="input-group">
                <label htmlFor="reset-email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? <><span className="spinner"></span> Enviando...</> : 'Enviar link de recuperação'}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <a href="/login">← Voltar ao login</a>
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
