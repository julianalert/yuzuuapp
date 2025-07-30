'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabase) {
        console.error('Supabase not configured')
        router.push('/signin')
        return
      }

      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/signin')
          return
        }

        if (data.session) {
          // Check if there's a website URL in the session storage (from homepage)
          const websiteUrl = sessionStorage.getItem('websiteUrl')
          
          if (websiteUrl) {
            // Clear the stored URL and redirect to signup with the URL
            sessionStorage.removeItem('websiteUrl')
            router.push(`/signup?url=${encodeURIComponent(websiteUrl)}`)
          } else {
            // No website URL, redirect to dashboard
            router.push('/dashboard')
          }
        } else {
          // No session, redirect to signin
          router.push('/signin')
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        router.push('/signin')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
} 