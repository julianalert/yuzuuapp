'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface MainCTAProps {
  onCampaignCreated?: () => void;
}

export default function MainCTA({ onCampaignCreated }: MainCTAProps) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleWebsiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        if (user) {
          // Create campaign directly if user is logged in
          const response = await fetch('/api/create-campaign', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: websiteUrl.trim(),
              email: user.email,
              user_id: user.id
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to create campaign');
          }

          // Clear the input and notify parent component
          setWebsiteUrl('');
          onCampaignCreated?.();
        } else {
          // Redirect to signup page with url as query string if not logged in
          router.push(`/signup?url=${encodeURIComponent(websiteUrl.trim())}`);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        if (!user) {
          router.push('/signup');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="border-t border-gray-200 text-center md:text-left">
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
            {isSubmitting ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
} 