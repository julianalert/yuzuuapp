import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { campaignId } = await request.json();

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    console.log('Exporting CSV for campaign:', campaignId);

    // Fetch leads for the campaign
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('sent', 'yes')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json({ error: `Failed to fetch leads: ${error.message}` }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json({ error: 'No leads found for this campaign' }, { status: 404 });
    }

    // Convert leads to CSV format
    const csvHeaders = [
      'Full Name',
      'Job Title',
      'Email',
      'Company Name',
      'Company Website',
      'Company LinkedIn',
      'Company Size',
      'Industry',
      'Country',
      'City',
      'LinkedIn URL',
      'Why Great Fit',
      'Warm Intro Message',
      'Created At'
    ];

    const csvRows = leads.map(lead => [
      lead.full_name || '',
      lead.job_title || '',
      lead.lead_email || '',
      lead.company_name || '',
      lead.company_website || '',
      lead.company_linkedin_url || '',
      lead.company_size || '',
      lead.industry || '',
      lead.country || '',
      lead.city || '',
      lead.linkedin_url || '',
      lead.whygreatfit || '',
      lead.warmintro || '',
      new Date(lead.created_at).toISOString()
    ]);

    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-${campaignId}-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Error exporting leads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 