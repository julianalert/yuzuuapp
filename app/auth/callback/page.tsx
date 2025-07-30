'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

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
          // Create Loops contact for Google OAuth user
          try {
            const user = data.session.user;
            console.log('Google OAuth user authenticated:', user);
            
            const fullNameParts = user.user_metadata?.full_name?.split(' ') || [];
            const firstName = fullNameParts[0] || '';
            const lastName = fullNameParts.slice(1).join(' ') || '';
            
            const websiteUrl = sessionStorage.getItem('websiteUrl');
            
            const loopsResponse = await fetch('/api/loops-google', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.email,
                firstName: firstName,
                lastName: lastName,
                website: websiteUrl,
              }),
            });
            
            const loopsResult = await loopsResponse.json();
            
            if (!loopsResult.success) {
              console.error('Failed to create Loops contact for Google user:', loopsResult.error);
            } else {
              console.log('Successfully created Loops contact for Google user');
            }
          } catch (loopsError) {
            console.error('Error creating Loops contact for Google user:', loopsError);
          }
          
          // User is authenticated, redirect to dashboard or signup with url if needed
          const websiteUrl = sessionStorage.getItem('websiteUrl')
          if (websiteUrl) {
            sessionStorage.removeItem('websiteUrl')
            router.push(`/signup?url=${encodeURIComponent(websiteUrl)}`)
          } else {
            router.push('/dashboard')
          }
        } else {
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