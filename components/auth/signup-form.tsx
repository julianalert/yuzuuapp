'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../lib/auth-context'
import { supabase } from '../../lib/supabase'


async function triggerWebhook({ url, email, campaignId }: { url: string, email: string, campaignId: string }) {
  if (!campaignId) throw new Error('No campaignId to send to webhook');
  try {
    await fetch('https://notanothermarketer.app.n8n.cloud/webhook/start-campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, email, campaignId })
    })
  } catch (err) {
    console.error('Webhook error:', err)
  }
}

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const urlFromQuery = searchParams.get('url') || '';
  const { user, signUp, signUpWithGoogle } = useAuth();
  const router = useRouter();

  // DEBUG: Log user on every render
  console.log('SignUpForm render: user:', user);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [campaignDone, setCampaignDone] = useState(false)
  const campaignInProgress = useRef(false)

  // If user is already authenticated (after Google OAuth), run campaign/webhook logic if needed
  useEffect(() => {
    const runCampaignLogic = async () => {
      console.log('useEffect triggered:', { user: !!user, campaignDone, urlFromQuery, campaignInProgress: campaignInProgress.current });
      
      if (user && !campaignDone && !campaignInProgress.current) {
        campaignInProgress.current = true;
        try {
          console.log('Signup effect: user:', user, 'urlFromQuery:', urlFromQuery);
          if (supabase && urlFromQuery) {
            // Check if campaign already exists for this user and url
            const { data: existing, error: existingError } = await supabase
              .from('campaign')
              .select('id')
              .eq('url', urlFromQuery)
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(1);
            let campaignId = existing && existing[0] && existing[0].id ? existing[0].id : null;
            if (existingError) {
              console.error('Error checking for existing campaign:', existingError);
            }
            if (!campaignId) {
              // Create campaign if not exists
              console.log('Creating campaign for user:', user.id, 'url:', urlFromQuery);
              const { data, error: campaignError } = await supabase.from('campaign').insert([
                {
                  url: urlFromQuery,
                  email: user.email,
                  user_id: user.id,
                }
              ]).select();
              if (campaignError) {
                setError('Could not create campaign');
                console.error('Campaign creation error:', campaignError);
                return;
              }
              campaignId = data && data[0] && data[0].id ? data[0].id : null;
              console.log('Created campaign, id:', campaignId);
            } else {
              console.log('Campaign already exists, id:', campaignId);
            }
            if (campaignId) {
              try {
                console.log('Triggering webhook for campaignId:', campaignId);
                await triggerWebhook({ url: urlFromQuery, email: user.email!, campaignId });
              } catch (webhookErr) {
                setError('Webhook error: ' + (webhookErr instanceof Error ? webhookErr.message : webhookErr));
                console.error('Webhook error:', webhookErr);
              }
            } else {
              setError('Could not find campaign id to send to webhook');
              console.error('No campaign id found for webhook');
            }
          } else {
            console.log('No supabase or no URL, skipping campaign creation.');
          }
        } finally {
          console.log('Campaign logic completed, setting campaignDone to true');
          setCampaignDone(true);
          campaignInProgress.current = false;
          
          // Create contact in Loops.so
          if (user && user.email) {
            try {
              console.log('User data for Loops:', user);
              console.log('User metadata:', user.user_metadata);
              
              // Try different ways to get the name from Google OAuth
              let firstName = '';
              let lastName = '';
              
              if (user.user_metadata?.full_name) {
                const fullNameParts = user.user_metadata.full_name.split(' ');
                firstName = fullNameParts[0] || '';
                lastName = fullNameParts.slice(1).join(' ') || '';
              } else if (user.user_metadata?.name) {
                const fullNameParts = user.user_metadata.name.split(' ');
                firstName = fullNameParts[0] || '';
                lastName = fullNameParts.slice(1).join(' ') || '';
              } else if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
                firstName = user.user_metadata.first_name;
                lastName = user.user_metadata.last_name;
              }
              
              console.log('Extracted name:', { firstName, lastName });
              
              const loopsResponse = await fetch('/api/loops', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: user.email,
                  firstName: firstName,
                  lastName: lastName,
                  website: urlFromQuery,
                  signupDate: new Date().toISOString(),
                  source: 'google_oauth_signup',
                }),
              });
              
              const loopsResult = await loopsResponse.json();
              
              if (!loopsResult.success) {
                console.error('Failed to create Loops contact:', loopsResult.error);
              } else {
                console.log('Successfully created Loops contact');
              }
            } catch (loopsError) {
              console.error('Error creating Loops contact:', loopsError);
            }
          }
          
          router.push('/dashboard');
        }
      }
    };
    runCampaignLogic();
  }, [user, urlFromQuery, campaignDone, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError(null)
  }

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      // Store the website URL in session storage before Google OAuth
      if (urlFromQuery) {
        sessionStorage.setItem('websiteUrl', urlFromQuery)
      }
      
      const result = await signUpWithGoogle()
      if (result.error) {
        setError(result.error.message || 'An error occurred during Google sign up')
      } else {
        // Force a delay to ensure user state is updated, then create Loops contact
        setTimeout(async () => {
          const currentUser = await supabase?.auth.getUser()
          if (currentUser?.data?.user) {
            console.log('Creating Loops contact for Google user:', currentUser.data.user)
            
            try {
              const fullNameParts = currentUser.data.user.user_metadata?.full_name?.split(' ') || [];
              const firstName = fullNameParts[0] || '';
              const lastName = fullNameParts.slice(1).join(' ') || '';
              
              const loopsResponse = await fetch('/api/loops', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: currentUser.data.user.email,
                  firstName: firstName,
                  lastName: lastName,
                  website: urlFromQuery,
                  signupDate: new Date().toISOString(),
                  source: 'google_oauth_signup',
                }),
              });
              
              const loopsResult = await loopsResponse.json();
              
              if (!loopsResult.success) {
                console.error('Failed to create Loops contact:', loopsResult.error);
              } else {
                console.log('Successfully created Loops contact for Google user');
              }
            } catch (loopsError) {
              console.error('Error creating Loops contact for Google user:', loopsError);
            }
          }
        }, 2000); // 2 second delay
      }
    } catch (err) {
      setError('An unexpected error occurred during Google sign up')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Basic validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('All fields are required')
      setLoading(false)
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      })
      if (result.error) {
        setError(result.error.message || 'An error occurred during sign up')
      } else {
        // Create contact in Loops.so for email/password signup
        try {
          const fullNameParts = formData.fullName.split(' ');
          const firstName = fullNameParts[0] || '';
          const lastName = fullNameParts.slice(1).join(' ') || '';
          
          const loopsResponse = await fetch('/api/loops', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              firstName: firstName,
              lastName: lastName,
              website: urlFromQuery,
              signupDate: new Date().toISOString(),
              source: 'website_signup',
            }),
          });
          
          const loopsResult = await loopsResponse.json();
          
          if (!loopsResult.success) {
            console.error('Failed to create Loops contact:', loopsResult.error);
          } else {
            console.log('Successfully created Loops contact');
          }
        } catch (loopsError) {
          console.error('Error creating Loops contact:', loopsError);
        }
        
        // Campaign creation and webhook will be handled by useEffect when user state updates
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (user && !campaignDone) {
    // Show nothing while campaign logic runs
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Finishing sign up...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-4 text-green-600">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account created successfully!</h2>
        <p className="text-gray-600">Please check your email to verify your account.</p>
        <p className="text-sm text-gray-500 mt-2">Redirecting you to the dashboard...</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold">You're one step away</h1>
        <p className="text-sm text-gray-500">Sign up to get your free leads</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <button 
            type="button"
            className="btn w-full bg-linear-to-t from-gray-900 to-gray-700 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Connecting to Google...
              </div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </>
            )}
          </button>
        </div>
        <div className="text-center text-sm italic text-gray-400 mb-6">Or</div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              name="fullName"
              className="form-input w-full py-2"
              type="text"
              placeholder="Corey Barker"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              className="form-input w-full py-2"
              type="email"
              placeholder="corybarker@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              className="form-input w-full py-2"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>
        <div className="mt-6">
          <button 
            type="submit"
            className="btn w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating account...
              </div>
            ) : (
              'Sign up'
            )}
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          By signing up, you agree to the Terms of Service and Privacy Policy.
        </p>
      </div>
    </>
  )
} 