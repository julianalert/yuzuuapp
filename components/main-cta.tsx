'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MainCTA() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const router = useRouter();

  const handleWebsiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl.trim()) {
      // Redirect to signup page
      router.push('/signup');
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
              >
                <path d="M10 6v2H9v6H7V8H6V6h4z"/>
                <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM2 14V2h12v12H2z"/>
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
            />
          </div>
          <button
            className="btn whitespace-nowrap bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%]"
            type="submit"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
} 