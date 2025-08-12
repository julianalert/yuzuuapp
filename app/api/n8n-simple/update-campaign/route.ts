import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaignId, ...updateFields } = body

    if (!campaignId) {
      return NextResponse.json({ error: 'campaignId is required' }, { status: 400 })
    }

    console.log('Updating campaign:', campaignId, 'with fields:', updateFields)

    // Update campaign using service role (bypasses RLS)
    const { data: campaign, error } = await supabase
      .from('campaign')
      .update(updateFields)
      .eq('id', campaignId)
      .select()
      .single()

    if (error) {
      console.error('Error updating campaign:', error)
      return NextResponse.json({ 
        error: error.message,
        details: error 
      }, { status: 500 })
    }

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found or not updated' }, { status: 404 })
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