import { supabase } from './supabase'
import { User, AuthError } from '@supabase/supabase-js'

export interface AuthResponse {
  user: User | null
  error: AuthError | null
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
}

export interface SignInData {
  email: string
  password: string
}

export const auth = {
  // Sign up with email and password
  async signUp({ email, password, fullName }: SignUpData): Promise<AuthResponse> {
    if (!supabase) {
      return { user: null, error: { message: 'Supabase not configured', status: 500 } as AuthError }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })

      return { user: data.user, error }
    } catch (error) {
      return { user: null, error: error as AuthError }
    }
  },

  // Sign up with Google OAuth
  async signUpWithGoogle(): Promise<{ error: AuthError | null }> {
    if (!supabase) {
      return { error: { message: 'Supabase not configured', status: 500 } as AuthError }
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  },

  // Sign in with Google OAuth
  async signInWithGoogle(): Promise<{ error: AuthError | null }> {
    if (!supabase) {
      return { error: { message: 'Supabase not configured', status: 500 } as AuthError }
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  },

  // Sign in with email and password
  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    if (!supabase) {
      return { user: null, error: { message: 'Supabase not configured', status: 500 } as AuthError }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return { user: data.user, error }
    } catch (error) {
      return { user: null, error: error as AuthError }
    }
  },

  // Sign out
  async signOut(): Promise<{ error: AuthError | null }> {
    if (!supabase) {
      return { error: { message: 'Supabase not configured', status: 500 } as AuthError }
    }

    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    if (!supabase) return null

    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    if (!supabase) return () => {}

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        callback(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }
} 