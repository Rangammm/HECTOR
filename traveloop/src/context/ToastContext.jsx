import { useState } from 'react'
import { ToastContext } from './toastContextValue'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  // Alias so pages can use either name
  const addToast = showToast

  return (
    <ToastContext.Provider value={{ showToast, addToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            color: '#fff',
            fontSize: '0.875rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            background: t.type === 'success' ? '#16a34a' : '#ef4444',
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}