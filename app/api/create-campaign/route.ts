import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const webhookUrl = 'https://notanothermarketer.app.n8n.cloud/webhook/start-campaign'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, email, user_id } = body

    if (!url || !email) {
      return NextResponse.json({ error: 'URL and email are required' }, { status: 400 })
    }

    // Create campaign using service role (bypasses RLS)
    const { data, error } = await supabase
      .from('campaign')
      .insert([{
        url: url.trim(),
        email: email.trim(),
        user_id: user_id || null
      }])
      .select()

    if (error) {
      console.error('Error creating campaign:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Trigger n8n webhook with the same URL and payload structure as before
    try {
      const campaign = data[0]
      const n8nResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: campaign.url,
          email: campaign.email,
          campaignId: campaign.id
        }),
      })

      if (!n8nResponse.ok) {
        console.error('Error triggering n8n webhook:', await n8nResponse.text())
      }
    } catch (webhookError) {
      console.error('Error calling n8n webhook:', webhookError)
    }

    return NextResponse.json({ campaign: data[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 