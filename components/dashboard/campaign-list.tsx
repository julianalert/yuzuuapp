'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/auth-context'
import { supabase } from '../../lib/supabase'
import DashboardCard from '../ui/dashboard-card'
import MainCTA from '../main-cta'

interface Campaign {
  id: string
  url?: string
  user_id: string
  created_at: string
  name?: string
  status?: 'active' | 'paused' | 'draft'
}

export default function CampaignList() {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [campaignLeadCounts, setCampaignLeadCounts] = useState<Record<string, number>>({})
  const [showMainCTA, setShowMainCTA] = useState(false)

  const fetchCampaigns = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      // Fetch campaigns
      const { data: campaignsData, error: campaignError } = await supabase!
        .from('campaign')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (campaignError) {
        console.error('Error fetching campaigns:', campaignError)
        setError('Failed to load campaigns')
        setLoading(false)
        return
      }

      setCampaigns(campaignsData || [])

      // Fetch lead counts for each campaign
      const leadCounts: Record<string, number> = {}
      await Promise.all(
        (campaignsData || []).map(async (campaign) => {
          const { count } = await supabase!
            .from('leads')
            .select('*', { count: 'exact', head: true })
            .eq('campaign_id', campaign.id)
            .eq('sent', 'yes')

          leadCounts[campaign.id] = count || 0
        })
      )

      setCampaignLeadCounts(leadCounts)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [user])

  const handleCampaignCreated = () => {
    setShowMainCTA(false)
    fetchCampaigns()
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="text-lg text-gray-700">Loading your campaigns...</p>
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

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Your Dashboard
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          Get started by creating your first campaign to begin generating leads.
        </p>
        {showMainCTA ? (
          <MainCTA onCampaignCreated={handleCampaignCreated} />
        ) : (
          <button
            onClick={() => setShowMainCTA(true)}
            className="btn bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Your First Campaign
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      {showMainCTA ? (
        <MainCTA onCampaignCreated={handleCampaignCreated} />
      ) : (
        <>
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Campaigns
              </h2>
              <p className="text-gray-600">
                Manage and monitor your lead generation campaigns
              </p>
            </div>
            <button
              onClick={() => setShowMainCTA(true)}
              className="btn bg-blue-600 hover:bg-blue-700 text-white"
            >
              New Campaign
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <DashboardCard
                key={campaign.id}
                campaign={{
                  name: campaign.name || campaign.url?.replace(/^https?:\/\//, '') || 'Unnamed Campaign',
                  link: `/dashboard/campaigns/${campaign.id}`,
                  status: campaign.status || 'active',
                  leadsCount: campaignLeadCounts[campaign.id]
                }}
              >
                Created {new Date(campaign.created_at).toLocaleDateString()}
              </DashboardCard>
            ))}
          </div>
        </>
      )}
    </div>
  )
} 