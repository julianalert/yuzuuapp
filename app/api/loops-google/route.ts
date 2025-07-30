import { NextRequest, NextResponse } from 'next/server';

const LOOPS_API_KEY = process.env.LOOPS_API_KEY;

export async function POST(request: NextRequest) {
  if (!LOOPS_API_KEY) {
    console.error('LOOPS_API_KEY is not configured');
    return NextResponse.json(
      { success: false, error: 'Loops API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { email, firstName, lastName, website } = await request.json();
    
    console.log('Creating Loops contact for Google OAuth user:', { email, firstName, lastName, website });

    const response = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOOPS_API_KEY}`,
      },
      body: JSON.stringify({
        email: email,
        firstName: firstName || '',
        lastName: lastName || '',
        subscribed: true,
        userProperties: {
          website: website || '',
          signupDate: new Date().toISOString(),
          source: 'google_oauth_signup',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Loops API error:', response.status, errorData);
      return NextResponse.json(
        { 
          success: false, 
          error: `Loops API error: ${response.status} - ${errorData.message || 'Unknown error'}` 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Loops contact created successfully for Google user:', data);
    
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Error creating Loops contact for Google user:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 