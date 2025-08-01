import { NextRequest, NextResponse } from 'next/server';

const LOOPS_API_KEY = process.env.LOOPS_API_KEY;

interface LoopsContact {
  email: string;
  firstName?: string;
  lastName?: string;
  website?: string;
  signupDate?: string;
  source?: string;
}

export async function POST(request: NextRequest) {
  if (!LOOPS_API_KEY) {
    console.error('LOOPS_API_KEY is not configured');
    return NextResponse.json(
      { success: false, error: 'Loops API key not configured' },
      { status: 500 }
    );
  }

  try {
    const contact: LoopsContact = await request.json();
    
    console.log('Creating Loops contact with data:', contact);

    const response = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOOPS_API_KEY}`,
      },
      body: JSON.stringify({
        email: contact.email,
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        subscribed: true,
        userProperties: {
          website: contact.website || '',
          signupDate: contact.signupDate || new Date().toISOString(),
          source: contact.source || 'website_signup',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Loops API error:', response.status, errorData);
      
      // Check if it's a duplicate contact (usually 409 or 400 with specific message)
      if (response.status === 409 || (errorData.message && errorData.message.toLowerCase().includes('already exists'))) {
        console.log('Contact already exists in Loops - this is normal for returning visitors');
        return NextResponse.json(
          { 
            success: true, 
            data: { message: 'Contact already exists' },
            isDuplicate: true
          },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Loops API error: ${response.status} - ${errorData.message || 'Unknown error'}` 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Loops contact created successfully:', data);
    
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Error creating Loops contact:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 