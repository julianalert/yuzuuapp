import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle both single lead and array of leads
    const leadsData = Array.isArray(body) ? body : [body]
    
    console.log('Creating leads:', leadsData.length, 'leads')

    // Validate required fields
    for (const lead of leadsData) {
      if (!lead.campaign_id) {
        return NextResponse.json({ error: 'campaign_id is required for all leads' }, { status: 400 })
      }
    }

    // Insert leads using service role (bypasses RLS)
    const { data: leads, error } = await supabase
      .from('leads')
      .insert(leadsData)
      .select()

    if (error) {
      console.error('Error creating leads:', error)
      return NextResponse.json({ 
        error: error.message,
        details: error 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      leads: leads,
      count: leads.length
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 