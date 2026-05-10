import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from './authContextValue'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data)
    } catch { /* profile may not exist yet */ }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) fetchProfile(u.id)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null
        setUser(u)
        if (u) fetchProfile(u.id)
        else setProfile(null)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password })

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({ provider: 'google' })

  const resetPassword = (email) =>
    supabase.auth.resetPasswordForEmail(email)

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      user, loading, profile, setProfile,
      signIn, signUp, signInWithGoogle, resetPassword, signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}