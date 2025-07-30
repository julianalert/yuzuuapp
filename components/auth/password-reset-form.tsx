'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

interface PasswordResetFormProps {
  onBack: () => void
}

export default function PasswordResetForm({ onBack }: PasswordResetFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (!email.trim()) {
      setError('Please enter your email address')
      setLoading(false)
      return
    }

    if (!supabase) {
      setError('Supabase is not configured')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
    })

    if (error) {
      setError(error.message || 'Failed to send reset email')
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold">Reset your password</h2>
        <p className="text-gray-500 text-sm mt-2">Enter your email and we'll send you a link to reset your password.</p>
      </div>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">Check your email for a password reset link.</p>
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="reset-email"
            type="email"
            className="form-input w-full py-2"
            placeholder="you@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="flex gap-2 mt-6">
          <button
            type="button"
            className="btn flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={onBack}
            disabled={loading}
          >
            Back
          </button>
          <button
            type="submit"
            className="btn flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </div>
      </form>
    </div>
  )
} 