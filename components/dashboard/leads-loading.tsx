'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/auth-context'
import { supabase } from '../../lib/supabase'

export default function LeadsLoading() {
  const { user } = useAuth()
  const [hasLeads, setHasLeads] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hasCampaigns, setHasCampaigns] = useState(true)
  const [checkedCampaigns, setCheckedCampaigns] = useState(false)

  useEffect(() => {
    const checkForLeads = async () => {
      if (!user || !supabase) {
        setLoading(false)
        return
      }

      try {
        // 1. Get all campaign IDs for this user
        const { data: campaigns, error: campaignError } = await supabase
          .from('campaign')
          .select('id')
          .eq('user_id', user.id)

        if (campaignError) {
          console.error('Error fetching campaigns:', campaignError)
          setLoading(false)
          return
        }

        const campaignIds = (campaigns || []).map(c => c.id)
        if (campaignIds.length === 0) {
          setHasCampaigns(false)
          setCheckedCampaigns(true)
          setLoading(false)
          return
        } else {
          setHasCampaigns(true)
          setCheckedCampaigns(true)
        }

        // 2. Check if there are any leads for these campaigns
        const { data: leads, error: leadsError } = await supabase
          .from('leads')
          .select('id')
          .in('campaign_id', campaignIds)
          .limit(1)

        if (leadsError) {
          console.error('Error checking for leads:', leadsError)
          setLoading(false)
          return
        }

        setHasLeads((leads && leads.length > 0) || false)
        setLoading(false)
      } catch (error) {
        console.error('Error checking for leads:', error)
        setLoading(false)
      }
    }

    checkForLeads()

    // Set up polling to check for leads every 30 seconds
    const interval = setInterval(checkForLeads, 30000)

    return () => clearInterval(interval)
  }, [user])

  // If loading, don't show anything
  if (loading) {
    return null
  }

  // If user has no campaigns, show the no-campaign message
  if (!hasCampaigns && checkedCampaigns) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          You don't have any campaign yet.
        </h2>
        <p className="text-lg text-gray-700 mb-2">
          Please create your first campaign.
        </p>
      </div>
    )
  }

  // If user has campaigns but no leads, show the loading spinner/message
  if (!hasLeads && hasCampaigns) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          We are getting your leads ready.
        </h2>
        <p className="text-lg text-gray-700 mb-2">
          You will receive them by email in the coming hour.
        </p>
      </div>
    )
  }

  // If user has leads, show nothing
  return null
} 