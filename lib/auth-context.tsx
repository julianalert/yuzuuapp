'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { auth, SignUpData, SignInData } from './auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (data: SignUpData) => Promise<{ user: User | null; error: any }>
  signUpWithGoogle: () => Promise<{ error: any }>
  signIn: (data: SignInData) => Promise<{ user: User | null; error: any }>
  signOut: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      try {
        const currentUser = await auth.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error getting initial user:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    // Listen to auth state changes
    const unsubscribe = auth.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUp = async (data: SignUpData) => {
    const result = await auth.signUp(data)
    if (result.user) {
      setUser(result.user)
    }
    return result
  }

  const signUpWithGoogle = async () => {
    const result = await auth.signUpWithGoogle()
    return result
  }

  const signIn = async (data: SignInData) => {
    const result = await auth.signIn(data)
    if (result.user) {
      setUser(result.user)
    }
    return result
  }

  const signOut = async () => {
    const result = await auth.signOut()
    if (!result.error) {
      setUser(null)
    }
    return result
  }

  const value = {
    user,
    loading,
    signUp,
    signUpWithGoogle,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 