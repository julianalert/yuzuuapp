'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/auth-context'

export default function UserProfile() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut()
      router.push('/signin')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">
          {user.user_metadata?.full_name || user.email}
        </p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
      >
        {loading ? 'Signing out...' : 'Sign out'}
      </button>
    </div>
  )
} 