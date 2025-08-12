'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function MainCTANoAccount() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailStep, setShowEmailStep] = useState(false);
  const router = useRouter();

  const handleWebsiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl.trim() && !isSubmitting) {
      setShowEmailStep(true);
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && websiteUrl.trim() && !isSubmitting) {
      setIsSubmitting(true);
      
      try {
        console.log('Creating campaign for:', { websiteUrl, email });
        
        // Create campaign via API endpoint
        const response = await fetch('/api/create-campaign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: websiteUrl.trim(),
            email: email.trim(),
            user_id: null, // No user_id since this is pre-signup
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create campaign');
        }

        const { campaign } = await response.json();
        console.log('Campaign created successfully:', campaign);
        
        // Get campaign ID for redirect
        const campaignId = campaign?.id;
        
        // Trigger webhook with campaign data
        try {
          if (campaignId) {
            console.log('Triggering webhook for campaignId:', campaignId);
            
            const webhookResponse = await fetch('https://notanothermarketer.app.n8n.cloud/webhook/start-campaign', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                url: websiteUrl.trim(),
                email: email.trim(),
                campaignId: campaignId,
              }),
            });
            
            if (!webhookResponse.ok) {
              console.error('Webhook error:', webhookResponse.status, webhookResponse.statusText);
            } else {
              console.log('Webhook triggered successfully');
            }
          } else {
            console.error('No campaign ID found in response');
          }
        } catch (webhookError) {
          console.error('Error triggering webhook:', webhookError);
        }
        
        // Create contact in Loops.so
        try {
          const loopsResponse = await fetch('/api/loops', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email.trim(),
              website: websiteUrl.trim(),
              source: 'homepage_cta',
              campaignId: campaignId,
            }),
          });
          
          const loopsResult = await loopsResponse.json();
          
          if (!loopsResult.success) {
            console.error('Failed to create Loops contact:', loopsResult.error);
            // Check if it's a duplicate email error
            if (loopsResult.error && loopsResult.error.includes('already exists')) {
              console.log('Contact already exists in Loops - this is normal for returning visitors');
            }
          } else {
            console.log('Successfully created/updated Loops contact');
          }
        } catch (loopsError) {
          console.error('Error creating Loops contact:', loopsError);
        }
        
        // Trigger final webhook
        try {
          console.log('Triggering final webhook');
          
          const finalWebhookResponse = await fetch('https://notanothermarketer.app.n8n.cloud/webhook/e3c5cfde-f363-432d-9cf2-3cc846dbe70a', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: websiteUrl.trim(),
              email: email.trim(),
              campaignId: campaignId,
              source: 'homepage_cta',
              timestamp: new Date().toISOString(),
            }),
          });
          
          if (!finalWebhookResponse.ok) {
            console.error('Final webhook error:', finalWebhookResponse.status, finalWebhookResponse.statusText);
          } else {
            console.log('Final webhook triggered successfully');
          }
        } catch (finalWebhookError) {
          console.error('Error triggering final webhook:', finalWebhookError);
        }
        
        // Redirect to leads page with campaign ID
        if (campaignId) {
          console.log('Redirecting to leads page with campaignId:', campaignId);
          router.push(`/leads?campaignId=${campaignId}`);
        } else {
          // Reset form if no campaign ID (fallback)
          setWebsiteUrl('');
          setEmail('');
          setShowEmailStep(false);
        }
        
      } catch (error) {
        console.error('Failed to create campaign:', error);
        // You might want to show an error message to the user here
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="border-t border-gray-200 text-center md:text-left">
      {!showEmailStep ? (
        <form onSubmit={handleWebsiteSubmit}>
          <div className="mx-auto flex max-w-sm flex-col justify-center sm:max-w-none sm:flex-row">
            <div className="relative mb-2 flex sm:mb-0 sm:mr-2 sm:min-w-[340px]">
              <div className="pointer-events-none absolute flex h-full w-10 items-center justify-center">
                <svg
                  className="fill-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                </svg>
              </div>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="form-input w-full pl-10"
                placeholder="Your website URL..."
                aria-label="Your website URL"
                required
                disabled={isSubmitting}
              />
            </div>
            <button
              className="btn whitespace-nowrap bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              Continue
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleEmailSubmit}>
          <div className="mx-auto flex max-w-sm flex-col justify-center sm:max-w-none sm:flex-row">
            <div className="relative mb-2 flex sm:mb-0 sm:mr-2 sm:min-w-[340px]">
              <div className="pointer-events-none absolute flex h-full w-10 items-center justify-center">
                <svg
                  className="fill-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input w-full pl-10"
                placeholder="Your email address..."
                aria-label="Your email address"
                required
                disabled={isSubmitting}
              />
            </div>
            <button
              className="btn whitespace-nowrap bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Redirecting...' : 'Get my free leads'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 