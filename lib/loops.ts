// Loops.so API integration
const LOOPS_API_KEY = process.env.LOOPS_API_KEY;

interface LoopsContact {
  email: string;
  firstName?: string;
  lastName?: string;
  website?: string;
  signupDate?: string;
  source?: string;
}

export async function createLoopsContact(contact: LoopsContact) {
  if (!LOOPS_API_KEY) {
    console.error('LOOPS_API_KEY is not configured');
    return { success: false, error: 'Loops API key not configured' };
  }

  try {
    const response = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOOPS_API_KEY}`,
      },
      body: JSON.stringify({
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        userProperties: {
          website: contact.website,
          signupDate: contact.signupDate,
          source: contact.source || 'website_signup',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Loops API error:', response.status, errorData);
      return { 
        success: false, 
        error: `Loops API error: ${response.status} - ${errorData.message || 'Unknown error'}` 
      };
    }

    const data = await response.json();
    console.log('Loops contact created successfully:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Error creating Loops contact:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function addContactToLoopsList(contact: LoopsContact, listId?: string) {
  if (!LOOPS_API_KEY) {
    console.error('LOOPS_API_KEY is not configured');
    return { success: false, error: 'Loops API key not configured' };
  }

  try {
    const response = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOOPS_API_KEY}`,
      },
      body: JSON.stringify({
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        userProperties: {
          website: contact.website,
          signupDate: contact.signupDate,
          source: contact.source || 'website_signup',
        },
        subscribed: true,
        ...(listId && { listId }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Loops API error:', response.status, errorData);
      return { 
        success: false, 
        error: `Loops API error: ${response.status} - ${errorData.message || 'Unknown error'}` 
      };
    }

    const data = await response.json();
    console.log('Loops contact added to list successfully:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Error adding contact to Loops list:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
} 