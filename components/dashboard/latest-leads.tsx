'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/auth-context'
import { supabase } from '../../lib/supabase'

// Type definitions
interface Lead {
  id: string
  full_name?: string
  job_title?: string
  photo_url?: string
  linkedin_url?: string
  company_name?: string
  company_website?: string
  company_linkedin_url?: string
  country?: string
  city?: string
  lead_email?: string
  campaign_id: string
  sent: string
  created_at: string
}

interface Campaign {
  id: string
  url?: string
  user_id: string
  created_at: string
}

// LinkedIn SVG icon
function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
    </svg>
  );
}

// Location SVG icon
function LocationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
      <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 4.418 5.373 9.293 5.601 9.507a1 1 0 001.398 0C10.627 17.293 16 12.418 16 8a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" />
    </svg>
  );
}

export default function LatestLeads() {
  const { user } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(20)
  const [hasMoreLeads, setHasMoreLeads] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalSentLeads, setTotalSentLeads] = useState(0)

  useEffect(() => {
    const fetchLatestLeads = async () => {
      if (!user || !supabase) {
        setLoading(false)
        return
      }

      try {
        // 1. Get the most recent campaign for this user
        const { data: campaigns, error: campaignError } = await supabase
          .from('campaign')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)

        if (campaignError) {
          console.error('Error fetching campaigns:', campaignError)
          setError('Failed to load campaigns')
          setLoading(false)
          return
        }

        if (!campaigns || campaigns.length === 0) {
          setLoading(false)
          return
        }

        const latestCampaign = campaigns[0]
        setCampaign(latestCampaign)

        // 2. Fetch leads for this campaign
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .eq('campaign_id', latestCampaign.id)
          .eq('sent', 'yes')
          .order('created_at', { ascending: false })
          .limit(displayCount)

        if (leadsError) {
          console.error('Error fetching leads:', leadsError)
          setError('Failed to load leads')
          setLoading(false)
          return
        }

        // Check if there are more leads available
        const { count: totalLeads } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', latestCampaign.id)
          .eq('sent', 'yes')

        setLeads(leadsData || [])
        setTotalSentLeads(totalLeads || 0)
        setHasMoreLeads(totalLeads ? totalLeads > displayCount : false)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching latest leads:', error)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    fetchLatestLeads()
  }, [user, displayCount])

  const loadMoreLeads = async () => {
    if (!campaign || !supabase) return

    setLoadingMore(true)
    const newDisplayCount = displayCount + 20

    try {
      const { data: additionalLeads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('campaign_id', campaign.id)
        .eq('sent', 'yes')
        .order('created_at', { ascending: false })
        .limit(newDisplayCount)

      if (leadsError) {
        console.error('Error fetching additional leads:', leadsError)
        return
      }

      // Check if there are more leads available
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', campaign.id)
        .eq('sent', 'yes')

      setLeads(additionalLeads || [])
      setDisplayCount(newDisplayCount)
      setTotalSentLeads(totalLeads || 0)
      setHasMoreLeads(totalLeads ? totalLeads > newDisplayCount : false)
    } catch (error) {
      console.error('Error loading more leads:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="text-lg text-gray-700">Loading your latest leads...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No campaigns found
        </h2>
        <p className="text-lg text-gray-700">
          Create your first campaign to start generating leads.
        </p>
      </div>
    )
  }

  if (!leads || leads.length === 0) {
    return (
      
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          We are getting your leads ready.
        </h2>
        <p className="text-lg text-gray-700">
          You will receive them by email when they are ready.
        </p>
      </div>
    )
  }

  const displayUrl = campaign.url ? campaign.url.replace(/^https?:\/\//, '') : ''

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {totalSentLeads} Leads from {displayUrl}
        </h2>
        <p className="text-gray-600">
          Showing {leads.length} of {totalSentLeads} leads from your latest campaign
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Lead
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Company
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Location
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="py-5 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-6">
                    <div className="flex items-center">
                      <div className="size-11 shrink-0">
                        {lead.photo_url ? (
                          <img alt="" src={lead.photo_url} className="size-11 rounded-full object-cover" />
                        ) : (
                          <div className="size-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">
                            {lead.full_name ? lead.full_name.split(' ').map((n) => n[0]).join('').slice(0,2).toUpperCase() : '?'}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {lead.full_name || '-'}
                          {lead.linkedin_url && (
                            <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer">
                              <LinkedInIcon className="h-4 w-4 text-blue-700 hover:text-blue-800" />
                            </a>
                          )}
                        </div>
                        {lead.job_title && (
                          <div className="text-gray-500 text-sm mt-1">
                            {lead.job_title.length > 30 ? lead.job_title.slice(0, 30) + '...' : lead.job_title}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                    <div className="text-gray-900 font-medium">
                      {lead.company_name
                        ? lead.company_name.length > 30
                          ? lead.company_name.slice(0, 30) + '...'
                          : lead.company_name
                        : '-'}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {lead.company_website ? (
                        <a
                          href={lead.company_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-blue-600"
                        >
                          {lead.company_website.length > 25
                            ? lead.company_website.slice(0, 25) + '...'
                            : lead.company_website}
                        </a>
                      ) : (
                        <span>-</span>
                      )}
                      {lead.company_linkedin_url && (
                        <a href={lead.company_linkedin_url} target="_blank" rel="noopener noreferrer">
                          <LinkedInIcon className="h-4 w-4 text-blue-700 hover:text-blue-800" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                      <LocationIcon className="h-4 w-4 text-gray-500" />
                      {lead.country || '-'}
                    </div>
                    <div className="mt-1 text-gray-500">
                      {lead.city || '-'}
                    </div>
                  </td>
                  <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                    {lead.lead_email || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {hasMoreLeads && (
        <div className="mt-12 text-center">
          <button 
            onClick={loadMoreLeads}
            disabled={loadingMore}
            className="btn-sm min-w-[220px] bg-gray-800 py-1.5 text-gray-200 shadow-sm hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? 'Loading...' : 'Load more'} {" "}
            <span className="ml-2 tracking-normal text-gray-500">↓</span>
          </button>
        </div>
      )}
    </div>
  )
} 