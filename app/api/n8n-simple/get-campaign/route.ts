import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')

    if (!campaignId) {
      return NextResponse.json({ error: 'campaignId is required' }, { status: 400 })
    }

    console.log('Getting campaign:', campaignId)

    // Get campaign data using service role (should bypass RLS)
    const { data: campaign, error } = await supabase
      .from('campaign')
      .select('*')
      .eq('id', campaignId)
      .single()

    if (error) {
      console.error('Error getting campaign:', error)
      return NextResponse.json({ 
        error: error.message,
        details: error 
      }, { status: 500 })
    }

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      campaign: campaign 
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 