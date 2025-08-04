'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import PaymentHandler from '../payment-handler'
import FeatureImg01 from "@/public/images/features-02-overlay-01.png";
import FeatureImg02 from "@/public/images/features-02-overlay-02.png";
import FeatureImg03 from "@/public/images/features-02-overlay-03.png";
import Image from 'next/image'

// LinkedIn SVG icon
function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
    </svg>
  );
}

// Link SVG icon
function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
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

// Lock SVG icon
function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );
}

interface Lead {
  id: string
  full_name?: string
  job_title?: string
  photo_url?: string
  linkedin_url?: string
  company_name?: string
  company_website?: string
  company_linkedin_url?: string
  company_size?: string
  industry?: string
  country?: string
  city?: string
  lead_email?: string
  campaign_id: string
  sent: string
  created_at: string
  whygreatfit?: string
  warmintro?: string
}

interface Campaign {
  id: string
  url?: string
  user_id: string
  created_at: string
  paid_status?: boolean
}

export default function CampaignLeads({ campaignId }: { campaignId: string }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(20)
  const [hasMoreLeads, setHasMoreLeads] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalSentLeads, setTotalSentLeads] = useState(0)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [exportingCsv, setExportingCsv] = useState(false)

  const toggleRow = (leadId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(leadId)) {
      newExpanded.delete(leadId)
    } else {
      newExpanded.add(leadId)
    }
    setExpandedRows(newExpanded)
  }

  const cleanMarkdownText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold** formatting
      .replace(/\*(.*?)\*/g, '$1') // Remove *italic* formatting
      .replace(/^\d+\.\s+/gm, '• ') // Convert numbered lists to bullet points
      .replace(/\n\n/g, '\n') // Remove extra line breaks
      .trim()
  }

  const exportCsv = async () => {
    if (!campaign) return;
    
    setExportingCsv(true);
    try {
      console.log('Starting CSV export for campaign:', campaign.id);
      
      const response = await fetch('/api/export-leads-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaignId: campaign.id }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to export CSV`);
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${campaign.id}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setExportingCsv(false);
    }
  };

  useEffect(() => {
    const fetchCampaignLeads = async () => {
      if (!supabase) {
        setError('Database not configured')
        setLoading(false)
        return
      }

      try {
        // 1. Get the campaign details
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaign')
          .select('*')
          .eq('id', campaignId)
          .single()

        if (campaignError) {
          console.error('Error fetching campaign:', campaignError)
          setError('Campaign not found')
          setLoading(false)
          return
        }

        setCampaign(campaignData)

        // 2. Fetch leads for this specific campaign
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .eq('campaign_id', campaignId)
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
          .eq('campaign_id', campaignId)
          .eq('sent', 'yes')

        console.log('Fetched leads data:', leadsData)
        setLeads(leadsData || [])
        setTotalSentLeads(totalLeads || 0)
        setHasMoreLeads(totalLeads ? totalLeads > displayCount : false)
        
        // Auto-expand the first lead if there are leads
        if (leadsData && leadsData.length > 0) {
          setExpandedRows(new Set([leadsData[0].id]))
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching campaign leads:', error)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    fetchCampaignLeads()
  }, [campaignId, displayCount])

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
        <p className="text-lg text-gray-700">Loading leads...</p>
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
          Campaign not found
        </h2>
        <p className="text-lg text-gray-700">
          The requested campaign could not be found.
        </p>
      </div>
    )
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="mx-auto max-w-3xl text-center">
         {/* Illustration  */}
        <div
            className="group relative mx-auto mb-16 flex w-full max-w-[500px] justify-center md:mb-10"
          >
            <div className="absolute bottom-0 -z-10" aria-hidden="true">
              <div className="h-80 w-80 rounded-full bg-blue-500 opacity-70 blur-[160px] will-change-[filter]" />
            </div>
            <div className="aspect-video w-full -rotate-1 rounded-2xl bg-gray-900 px-5 py-3 shadow-xl transition duration-300 group-hover:-rotate-0">
              <div className="relative mb-8 flex items-center justify-between before:block before:h-[9px] before:w-[41px] before:bg-[length:16px_9px] before:[background-image:radial-gradient(circle_at_4.5px_4.5px,var(--color-gray-600)_4.5px,transparent_0)] after:w-[41px]">
                <span className="text-[13px] font-medium text-white">
                Processing your leads...
                </span>
              </div>
              <div className="font-mono text-sm text-gray-500 transition duration-300 [&_span]:opacity-0">
                <span className="animate-[code-1_5s_infinite] text-gray-200">
                  🤖 beep b00p!
                </span>{" "}
                <br />
                <span className="animate-[code-2_5s_infinite]">
                  I'm getting your leads ready.
                </span>
                <br />
                <span className="animate-[code-3_5s_infinite]">
                  You will receive an email when they are ready.
                </span>{" "}
                <br />
                <br />
                <span className="animate-[code-4_5s_infinite] text-gray-200">
                  You will love it.
                </span>
                <br />
                <span className="animate-[code-5_5s_infinite]">
                  At least, I hope.
                </span>
              </div>
            </div>
          </div>
          <p className="text-lg text-gray-500 pt-4">
            This takes a few minutes. <br /> You can wait and refresh the page to see the latest leads.
            </p>
      </div>
    )
  }

  const displayUrl = campaign.url ? campaign.url.replace(/^https?:\/\//, '') : ''

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {totalSentLeads} Leads from {displayUrl}
          </h2>
          <p className="text-gray-600">
            Tomorrow, 3 new leads will be added to your list.
          </p>
        </div>
        <div className="flex-shrink-0">
          {campaign?.paid_status ? (
            <button
              onClick={exportCsv}
              disabled={exportingCsv}
              className="btn bg-gray-800 font-normal text-gray-200 shadow-sm hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="mr-2 fill-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4h8v2H6V4zm0 4h8v2H6V8zm0 4h6v2H6v-2z"/>
              </svg>
              {exportingCsv ? 'Exporting...' : 'Export as CSV'}
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                disabled
                className="btn bg-gray-800 font-normal text-gray-200 shadow-sm opacity-50 cursor-not-allowed"
              >
                <svg
                  className="mr-2 fill-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4h8v2H6V4zm0 4h8v2H6V8zm0 4h6v2H6v-2z"/>
                </svg>
                Export as CSV
                <LockIcon className="ml-2 h-3 w-3 text-gray-500" />
              </button>
              <PaymentHandler 
                campaignId={campaignId}
                onSuccess={() => {
                  // Refresh the page to show updated paid status
                  window.location.reload();
                }}
                onError={(error) => {
                  console.error('Payment error:', error);
                  // You could add a toast notification here
                }}
              />
            </div>
          )}
        </div>
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
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {leads.map((lead) => (
                <React.Fragment key={lead.id}>
                  <tr className="hover:bg-gray-50">
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
                            campaign?.paid_status ? (
                              <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer">
                                <LinkedInIcon className="h-4 w-4 text-blue-700 hover:text-blue-800" />
                              </a>
                            ) : (
                              <div className="flex items-center gap-1">
                                <LinkedInIcon className="h-4 w-4 text-gray-400" />
                                <LockIcon className="h-3 w-3 text-gray-500" />
                              </div>
                            )
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
                    <div className="text-gray-900 font-medium flex items-center gap-2">
                      {lead.company_name
                        ? lead.company_name.length > 30
                          ? lead.company_name.slice(0, 30) + '...'
                          : lead.company_name
                        : '-'}
                      {lead.company_website && (
                        <a href={lead.company_website} target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="h-4 w-4 text-blue-700 hover:text-blue-800" />
                        </a>
                      )}
                      {lead.company_linkedin_url && (
                        campaign?.paid_status ? (
                          <a href={lead.company_linkedin_url} target="_blank" rel="noopener noreferrer">
                            <LinkedInIcon className="h-4 w-4 text-blue-700 hover:text-blue-800" />
                          </a>
                        ) : (
                          <div className="flex items-center gap-1">
                            <LinkedInIcon className="h-4 w-4 text-gray-400" />
                            <LockIcon className="h-3 w-3 text-gray-500" />
                          </div>
                        )
                      )}
                    </div>
                    <div className="mt-1 text-gray-500">
                      {lead.company_size && lead.industry ? (
                        <span>
                          {lead.company_size} - {lead.industry.length > 12 ? lead.industry.slice(0, 12) + '...' : lead.industry}
                        </span>
                      ) : lead.company_size ? (
                        <span>{lead.company_size}</span>
                      ) : lead.industry ? (
                        <span>{lead.industry.length > 12 ? lead.industry.slice(0, 12) + '...' : lead.industry}</span>
                      ) : (
                        <span>-</span>
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
                    {campaign?.paid_status ? (
                      lead.lead_email || '-'
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <LockIcon className="h-4 w-4" />
                        <span>Locked</span>
                      </div>
                    )}
                  </td>
                    <td className="px-3 py-5 text-sm text-gray-500">
                      <button
                        onClick={() => toggleRow(lead.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        {expandedRows.has(lead.id) ? 'Hide Details' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(lead.id) && (
                    <tr key={`${lead.id}-expanded`} className="bg-gray-50">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="space-y-4">
                          {campaign?.paid_status ? (
                            <>
                              {lead.whygreatfit && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Why It's A Great Fit</h4>
                                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                    {cleanMarkdownText(lead.whygreatfit)}
                                  </div>
                                </div>
                              )}
                              {lead.warmintro && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Your Personalized Warm Intro Message</h4>
                                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                    {cleanMarkdownText(lead.warmintro)}
                                  </div>
                                </div>
                              )}
                              {!lead.whygreatfit && !lead.warmintro && (
                                <p className="text-sm text-gray-500 italic">No additional details available</p>
                              )}
                            </>
                          ) : (
                            <>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                  Why It's A Great Fit
                                  <LockIcon className="h-4 w-4 text-gray-500" />
                                </h4>
                                <div className="text-sm text-gray-500 italic">
                                  Unlock to see why this lead is a great fit for your business
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                  Your Personalized Warm Intro Message
                                  <LockIcon className="h-4 w-4 text-gray-500" />
                                </h4>
                                <div className="text-sm text-gray-500 italic">
                                  Unlock to see your personalized warm intro message for this lead
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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