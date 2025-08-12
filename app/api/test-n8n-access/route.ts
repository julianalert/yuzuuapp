import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')

    console.log('Testing service role access...')
    console.log('Campaign ID:', campaignId)

    // Test 1: Get all campaigns (should work with service role)
    const { data: allCampaigns, error: allError } = await supabase
      .from('campaign')
      .select('*')
      .limit(5)

    console.log('All campaigns:', allCampaigns)
    console.log('All campaigns error:', allError)

    // Test 2: Get specific campaign if ID provided
    let specificCampaign = null
    let specificError = null
    
    if (campaignId) {
      const result = await supabase
        .from('campaign')
        .select('*')
        .eq('id', campaignId)
        .single()
      
      specificCampaign = result.data
      specificError = result.error
      
      console.log('Specific campaign:', specificCampaign)
      console.log('Specific campaign error:', specificError)
    }

    return NextResponse.json({
      success: true,
      serviceRoleWorking: !allError,
      allCampaigns: allCampaigns || [],
      allCampaignsError: allError?.message,
      specificCampaign,
      specificCampaignError: specificError?.message,
      totalCampaigns: allCampaigns?.length || 0
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 